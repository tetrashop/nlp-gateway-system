import { NextResponse } from 'next/server';
import { validateToken, logRequest } from '@/services/gateway/core';
import { rateLimiter } from '@/services/gateway/rate-limiter';

// نقشه کامل ۲۸ سرویس با آدرس‌های واقعی/نمونه
const SERVICE_ROUTES = {
  // گروه احراز هویت و کاربران (۵ سرویس)
  'auth': process.env.AUTH_SERVICE_URL || 'https://auth-service.example.com',
  'users': process.env.USER_SERVICE_URL || 'http://localhost:3000/api/v1/users',
  'profiles': process.env.USER_SERVICE_URL ? `${process.env.USER_SERVICE_URL}/profiles` : 'https://user-service.example.com/profiles',
  'permissions': process.env.USER_SERVICE_URL ? `${process.env.USER_SERVICE_URL}/permissions` : 'https://user-service.example.com/permissions',
  'roles': process.env.USER_SERVICE_URL ? `${process.env.USER_SERVICE_URL}/roles` : 'https://user-service.example.com/roles',
  
  // گروه پردازش متن و اسناد (۵ سرویس)
  'documents': process.env.DOCUMENT_SERVICE_URL || 'http://localhost:3000/api/v1/nlp',
  'text': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/text` : 'http://localhost:3000/api/v1/nlp',
  'summarize': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/summarize` : 'http://localhost:3000/api/v1/nlp',
  'translate': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/translate` : 'https://translate-service.example.com',
  'ocr': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/ocr` : 'https://ocr-service.example.com',
  
  // گروه هوش مصنوعی و NLP (۶ سرویس)
  'ai': process.env.AI_SERVICE_URL || 'https://ai-service.example.com',
  'nlp': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/nlp` : 'http://localhost:3000/api/v1/nlp',
  'sentiment': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/sentiment` : 'http://localhost:3000/api/v1/nlp',
  'ner': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/ner` : 'https://ner-service.example.com',
  'classify': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/classify` : 'https://classify-service.example.com',
  'embeddings': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/embeddings` : 'https://embeddings-service.example.com',
  
  // گروه پرداخت و مالی (۴ سرویس)
  'payments': process.env.PAYMENT_SERVICE_URL || 'http://localhost:3000/api/v1/payments',
  'invoices': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/invoices` : 'https://invoice-service.example.com',
  'subscriptions': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/subscriptions` : 'https://subscription-service.example.com',
  'transactions': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/transactions` : 'https://transaction-service.example.com',
  
  // گروه تحلیل و گزارش (۴ سرویس)
  'analytics': process.env.ANALYTICS_SERVICE_URL || 'https://analytics-service.example.com',
  'reports': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/reports` : 'https://report-service.example.com',
  'metrics': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/metrics` : 'https://metrics-service.example.com',
  'dashboard': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/dashboard` : 'https://dashboard-service.example.com',
  
  // گروه ذخیره‌سازی و فایل (۴ سرویس)
  'storage': process.env.STORAGE_SERVICE_URL || 'https://storage-service.example.com',
  'files': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/files` : 'https://file-service.example.com',
  'uploads': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/uploads` : 'https://upload-service.example.com',
  'cdn': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/cdn` : 'https://cdn-service.example.com'
};

// کلیدهای API برای سرویس‌های خارجی
const SERVICE_KEYS = {
  'auth': 'AUTH_API_KEY',
  'ai': 'AI_API_KEY',
  'payments': 'PAYMENT_API_KEY',
  'analytics': 'ANALYTICS_API_KEY',
  'storage': 'STORAGE_API_KEY',
};

// سرویس‌های نیازمند احراز هویت
const PROTECTED_SERVICES = ['users', 'profiles', 'payments', 'documents', 'files', 'transactions'];

// کش درخواست‌ها
const requestCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 دقیقه

async function proxyRequest(method, targetUrl, headers, body = null) {
  const cacheKey = `${method}:${targetUrl}`;
  const now = Date.now();
  
  // بررسی کش برای GET requests
  if (method === 'GET') {
    const cached = requestCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('✅ Serving from cache:', cacheKey);
      return cached.response;
    }
  }
  
  const options = {
    method,
    headers,
    redirect: 'follow',
    timeout: 10000 // 10 ثانیه timeout
  };
  
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = body;
  }
  
  try {
    console.log('🌐 Forwarding request to:', targetUrl);
    const response = await fetch(targetUrl, options);
    
    // پردازش پاسخ
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }
    
    const result = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: data,
      cached: false
    };
    
    // ذخیره در کش برای GET requests موفق
    if (method === 'GET' && response.status === 200) {
      requestCache.set(cacheKey, {
        timestamp: now,
        response: result
      });
      
      // محدود کردن اندازه کش
      if (requestCache.size > 100) {
        const firstKey = requestCache.keys().next().value;
        requestCache.delete(firstKey);
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('Proxy request failed:', error);
    throw error;
  }
}

export async function GET(request, { params }) {
  return handleGatewayRequest('GET', request, params);
}

export async function POST(request, { params }) {
  return handleGatewayRequest('POST', request, params);
}

export async function PUT(request, { params }) {
  return handleGatewayRequest('PUT', request, params);
}

export async function DELETE(request, { params }) {
  return handleGatewayRequest('DELETE', request, params);
}

export async function PATCH(request, { params }) {
  return handleGatewayRequest('PATCH', request, params);
}

async function handleGatewayRequest(method, request, { service }) {
  try {
    // ۱. لاگ درخواست
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await logRequest(method, service?.join('/') || '', requestId);
    
    // ۲. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    if (!await rateLimiter(ip)) {
      return NextResponse.json(
        { 
          error: 'محدودیت نرخ درخواست',
          message: 'تعداد درخواست‌های شما از حد مجاز بیشتر شده است.',
          retry_after: '60'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': '60',
            'Retry-After': '60'
          }
        }
      );
    }
    
    // ۳. تشخیص سرویس مقصد
    if (!service || service.length === 0) {
      // اگر مسیر ریشه Gateway بود
      return NextResponse.json({
        gateway: 'nlp-gateway-v1',
        status: 'operational',
        services_available: Object.keys(SERVICE_ROUTES).length,
        message: 'برای دسترسی به سرویس‌ها، نام سرویس را در URL مشخص کنید',
        example: 'GET /api/v1/users'
      });
    }
    
    const [serviceKey, ...pathParts] = service;
    const targetBaseUrl = SERVICE_ROUTES[serviceKey];
    
    if (!targetBaseUrl) {
      return NextResponse.json(
        { 
          error: 'سرویس پیدا نشد',
          requested_service: serviceKey,
          available_services: Object.keys(SERVICE_ROUTES).slice(0, 10),
          help: 'برای مشاهده همه سرویس‌ها: GET /api/v1'
        },
        { status: 404 }
      );
    }
    
    // ۴. بررسی احراز هویت برای سرویس‌های محافظت‌شده
    if (PROTECTED_SERVICES.includes(serviceKey)) {
      const authResult = await validateToken(request);
      if (!authResult.valid) {
        return NextResponse.json(
          { 
            error: 'دسترسی غیرمجاز',
            message: 'برای دسترسی به این سرویس نیاز به احراز هویت دارید.',
            service: serviceKey,
            auth_required: true
          },
          { status: 401 }
        );
      }
    }
    
    // ۵. ساخت آدرس مقصد
    const remainingPath = pathParts.join('/');
    const searchParams = request.nextUrl.searchParams;
    
    let targetUrl;
    if (targetBaseUrl.startsWith('http')) {
      // سرویس خارجی
      targetUrl = new URL(`${targetBaseUrl}/${remainingPath}`);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
      });
    } else {
      // سرویس داخلی (همان سرور)
      targetUrl = new URL(`${targetBaseUrl}/${remainingPath}`, request.nextUrl.origin);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
      });
    }
    
    // ۶. آماده‌سازی هدرها
    const headers = new Headers();
    
    // کلید API سرویس مقصد
    const apiKeyEnv = SERVICE_KEYS[serviceKey];
    if (apiKeyEnv && process.env[apiKeyEnv]) {
      headers.set('X-API-Key', process.env[apiKeyEnv]);
    }
    
    // توکن کاربر
    const authToken = request.headers.get('authorization');
    if (authToken) {
      headers.set('Authorization', authToken);
    }
    
    // هدرهای اصلی
    const contentType = request.headers.get('content-type');
    if (contentType && !contentType.includes('multipart/form-data')) {
      headers.set('Content-Type', contentType);
    }
    
    // هدرهای اضافی برای رهگیری
    headers.set('X-Forwarded-For', ip);
    headers.set('X-Gateway-Request-ID', requestId);
    headers.set('X-Gateway-Service', serviceKey);
    headers.set('User-Agent', `NLP-Gateway/1.0 (+http://localhost:3000)`);
    
    // ۷. آماده‌سازی body
    let requestBody = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (contentType && contentType.includes('application/json')) {
        requestBody = await request.text();
      } else if (contentType && contentType.includes('multipart/form-data')) {
        requestBody = await request.formData();
        headers.delete('Content-Type'); // اجازه می‌دهد مرورگر هدر را تنظیم کند
      }
    }
    
    // ۸. ارسال درخواست به سرویس مقصد
    const startTime = Date.now();
    const proxyResponse = await proxyRequest(method, targetUrl.toString(), headers, requestBody);
    const processingTime = Date.now() - startTime;
    
    // ۹. ساخت پاسخ نهایی
    const responseHeaders = new Headers(proxyResponse.headers);
    responseHeaders.set('X-Gateway-Processed', 'true');
    responseHeaders.set('X-Gateway-Cache', proxyResponse.cached ? 'HIT' : 'MISS');
    responseHeaders.set('X-Processing-Time', `${processingTime}ms`);
    responseHeaders.set('X-Service', serviceKey);
    
    // ۱۰. بازگرداندن پاسخ
    return new NextResponse(
      typeof proxyResponse.data === 'string' ? proxyResponse.data : JSON.stringify(proxyResponse.data),
      {
        status: proxyResponse.status,
        statusText: proxyResponse.status < 400 ? 'OK' : 'Error',
        headers: responseHeaders
      }
    );
    
  } catch (error) {
    console.error('Gateway Error:', error);
    
    // لاگ خطا
    await logRequest('ERROR', service?.join('/') || '', null, error.message);
    
    return NextResponse.json(
      { 
        error: 'خطای Gateway',
        message: 'سرویس مقصد در دسترس نیست یا خطایی رخ داده است.',
        service: service?.join('/'),
        gateway_error: error.message,
        timestamp: new Date().toISOString(),
        support: 'در صورت تکرار خطا، با پشتیبانی تماس بگیرید.'
      },
      { 
        status: 502,
        headers: {
          'X-Gateway-Error': 'true',
          'X-Gateway-Error-Type': 'connection_failed'
        }
      }
    );
  }
}
