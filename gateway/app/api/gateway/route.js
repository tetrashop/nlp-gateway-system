import { NextResponse } from 'next/server';

// نقشه ۲۸ سرویس
const SERVICE_ROUTES = {
  'auth': process.env.AUTH_SERVICE_URL || 'https://auth-service.example.com',
  'users': process.env.USER_SERVICE_URL || 'https://user-service.example.com',
  'documents': process.env.DOCUMENT_SERVICE_URL || 'https://document-service.example.com',
  'text': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/text` : 'https://document-service.example.com/text',
  'summarize': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/summarize` : 'https://document-service.example.com/summarize',
  'translate': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/translate` : 'https://document-service.example.com/translate',
  'ocr': process.env.DOCUMENT_SERVICE_URL ? `${process.env.DOCUMENT_SERVICE_URL}/ocr` : 'https://document-service.example.com/ocr',
  'ai': process.env.AI_SERVICE_URL || 'https://ai-service.example.com',
  'nlp': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/nlp` : 'https://ai-service.example.com/nlp',
  'sentiment': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/sentiment` : 'https://ai-service.example.com/sentiment',
  'ner': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/ner` : 'https://ai-service.example.com/ner',
  'classify': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/classify` : 'https://ai-service.example.com/classify',
  'embeddings': process.env.AI_SERVICE_URL ? `${process.env.AI_SERVICE_URL}/embeddings` : 'https://ai-service.example.com/embeddings',
  'payments': process.env.PAYMENT_SERVICE_URL || 'https://payment-service.example.com',
  'invoices': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/invoices` : 'https://payment-service.example.com/invoices',
  'subscriptions': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/subscriptions` : 'https://payment-service.example.com/subscriptions',
  'transactions': process.env.PAYMENT_SERVICE_URL ? `${process.env.PAYMENT_SERVICE_URL}/transactions` : 'https://payment-service.example.com/transactions',
  'analytics': process.env.ANALYTICS_SERVICE_URL || 'https://analytics-service.example.com',
  'reports': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/reports` : 'https://analytics-service.example.com/reports',
  'metrics': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/metrics` : 'https://analytics-service.example.com/metrics',
  'dashboard': process.env.ANALYTICS_SERVICE_URL ? `${process.env.ANALYTICS_SERVICE_URL}/dashboard` : 'https://analytics-service.example.com/dashboard',
  'storage': process.env.STORAGE_SERVICE_URL || 'https://storage-service.example.com',
  'files': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/files` : 'https://storage-service.example.com/files',
  'uploads': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/uploads` : 'https://storage-service.example.com/uploads',
  'cdn': process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/cdn` : 'https://storage-service.example.com/cdn',
  'notifications': process.env.NOTIFICATION_SERVICE_URL || 'https://notifications.example.com',
  'email': process.env.EMAIL_SERVICE_URL || 'https://email.example.com',
  'sms': process.env.SMS_SERVICE_URL || 'https://sms.example.com',
  'config': process.env.CONFIG_SERVICE_URL || 'https://config.example.com',
  'logs': process.env.LOG_SERVICE_URL || 'https://logs.example.com',
};

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // اگر query parameter ?status=health داشته باشیم
  if (searchParams.get('status') === 'health') {
    return NextResponse.json({
      status: 'operational',
      gateway: 'nlp-gateway-v1',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services_configured: Object.keys(SERVICE_ROUTES).length,
      environment: process.env.NODE_ENV || 'development',
    });
  }
  
  // endpoint اصلی برای نمایش اطلاعات Gateway
  return NextResponse.json({
    message: 'NLP Gateway API v1.0',
    description: 'Gateway مرکزی برای مدیریت ۲۸ سرویس مختلف',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      root: '/api/v1',
      services: '/api/v1/{service}/{endpoint}',
      health: '/api/v1?status=health',
      gateway_status: '/api/health',
    },
    services: Object.keys(SERVICE_ROUTES).map(service => ({
      name: service,
      path: `/api/v1/${service}/{endpoint}`,
      base_url: SERVICE_ROUTES[service].replace(/^https?:\/\//, '').split('/')[0],
      status: 'available'
    })),
    examples: {
      auth_login: 'POST /api/v1/auth/login',
      text_process: 'POST /api/v1/text/process',
      ai_chat: 'POST /api/v1/ai/chat',
      payments_create: 'POST /api/v1/payments/create',
    },
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  
  return NextResponse.json({
    message: 'برای استفاده از سرویس‌ها، endpoint خاص سرویس را فراخوانی کنید',
    error: 'method_not_supported_on_root',
    supported_methods: ['GET'],
    example_usage: 'POST /api/v1/auth/login',
    received_body: body,
    timestamp: new Date().toISOString()
  }, { status: 405 });
}
