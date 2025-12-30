import { NextRequest, NextResponse } from 'next/server';

const subscriptions = new Map();

// سرویس‌های معتبر - حالا هر عددی برای NLP معتبر است
const validServices: Record<string, string> = {
  'nlp': 'پلتفرم پروژه‌های NLP فارسی',
  'chess': 'شطرنج هوشمند Tetris-Chess',
  'ocr': 'سامانه ضد چندپارگی OCR',
  'garden': 'باغ رازآلود',
  'assistant': 'دستیار هوشمند فارسی'
};

// تابع جدید: تشخیص اینکه آیا سرویس مربوط به NLP است
function isNLPService(serviceId: string): boolean {
  // اگر شناسه عددی است یا با 'nlp' شروع می‌شود
  return !isNaN(Number(serviceId)) || serviceId.toLowerCase().startsWith('nlp');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 بدنه دریافتی:', JSON.stringify(body));
    
    const { serviceId, serviceName, userEmail = 'user@tetrasaas.ir' } = body;

    if (!serviceId || !serviceName) {
      console.log('❌ پارامترهای ناقص:', { serviceId, serviceName });
      return NextResponse.json(
        { 
          success: false, 
          error: 'پارامترهای ورودی ناقص',
          message: 'لطفاً شناسه سرویس (serviceId) و نام سرویس (serviceName) را ارسال کنید.'
        },
        { status: 400 }
      );
    }

    const serviceKey = serviceId.toString().toLowerCase().trim();
    console.log('🔍 شناسه سرویس:', serviceKey);

    // منطق جدید: اگر سرویس NLP است، بپذیر
    let finalServiceKey = serviceKey;
    let serviceDisplayName = '';

    if (isNLPService(serviceKey)) {
      // این یک پروژه NLP است
      finalServiceKey = 'nlp';
      serviceDisplayName = `پروژه NLP شماره ${serviceKey}`;
      console.log('✅ شناسه NLP تشخیص داده شد:', serviceKey);
    } else if (validServices[serviceKey]) {
      // سرویس‌های دیگر (chess, ocr, etc.)
      finalServiceKey = serviceKey;
      serviceDisplayName = validServices[serviceKey];
    } else {
      console.log('❌ سرویس نامعتبر:', serviceKey);
      return NextResponse.json(
        { 
          success: false, 
          error: 'سرویس نامعتبر',
          message: `سرویس "${serviceId}" پشتیبانی نمی‌شود.`,
          validServices: ['nlp (یا هر عددی)', ...Object.keys(validServices)]
        },
        { status: 404 }
      );
    }

    // ایجاد کلید API
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const apiKey = `tetra_${finalServiceKey}_${serviceKey}_${timestamp}_${randomStr}`;
    
    const expiresAt = new Date(timestamp + 30 * 24 * 60 * 60 * 1000);

    // ذخیره اطلاعات
    const subscriptionId = `sub_${timestamp}`;
    const subscriptionData = {
      id: subscriptionId,
      serviceId: finalServiceKey,
      projectId: serviceKey, // ذخیره شناسه پروژه اصلی
      serviceName: serviceDisplayName || serviceName,
      apiKey,
      userEmail,
      expiresAt,
      createdAt: new Date(timestamp),
      requestCount: 0,
      isActive: true,
      tier: 'free'
    };

    subscriptions.set(subscriptionId, subscriptionData);
    console.log('✅ اشتراک ایجاد شد:', subscriptionId);

    // پاسخ
    const responseData = {
      success: true,
      message: `اشتراک "${serviceDisplayName || serviceName}" با موفقیت فعال شد!`,
      data: {
        subscriptionId,
        apiKey,
        projectId: serviceKey,
        expiresAt: expiresAt.toLocaleDateString('fa-IR'),
        endpoint: `https://api.tetrasaas.ir/v1/${finalServiceKey}/${serviceKey}`,
        documentation: `/nlp/${serviceKey}`,
        limits: {
          dailyRequests: 1000,
          monthlyRequests: 30000,
          rateLimit: '10 درخواست در ثانیه'
        }
      }
    };
    
    console.log('📤 پاسخ ارسالی:', responseData);
    
    return NextResponse.json(responseData, { 
      status: 201
    });

  } catch (error) {
    console.error('❌ خطا در ایجاد اشتراک:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطای سرور',
        message: 'سرور در پردازش درخواست با مشکل مواجه شد.',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { 
        status: 500
      }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get('apiKey');

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'کلید API الزامی است' },
      { status: 400 }
    );
  }

  const subscription = Array.from(subscriptions.values()).find(sub => sub.apiKey === apiKey);

  if (!subscription) {
    return NextResponse.json(
      { success: false, error: 'اشتراک یافت نشد' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      serviceName: subscription.serviceName,
      projectId: subscription.projectId,
      expiresAt: subscription.expiresAt.toLocaleDateString('fa-IR'),
      requestCount: subscription.requestCount,
      isActive: subscription.isActive
    }
  });
}
