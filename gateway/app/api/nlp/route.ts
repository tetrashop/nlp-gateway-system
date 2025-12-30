import { NextRequest, NextResponse } from 'next/server';

// ========== تعریف سرویس‌های NLP (مشابه data/nlpServices.ts) ==========
const nlpServices = [
  {
    id: 1,
    name: "تحلیل احساسات فارسی (Flask)",
    description: "تشخیص احساسات متن فارسی با استفاده از سرویس Flask داخلی",
    category: "تحلیل",
    status: "active",
    endpoint: "/sentiment",
    // 🔥 آدرس حیاتی: اینجا آدرس سرویس Flask شماست
    internalUrl: "http://localhost:8001/analyze",
    latency: 100,
    rateLimit: 50
  },
  {
    id: 2,
    name: "سرویس تست",
    description: "یک سرویس نمونه برای تست Gateway",
    category: "تست",
    status: "active",
    endpoint: "/test",
    internalUrl: "http://localhost:8001/health",
    latency: 50,
    rateLimit: 100
  }
];
// ========== پایان تعریف سرویس‌ها ==========

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, text } = body; // می‌توانید action, options را حذف کنید

    // ۱. اعتبارسنجی ورودی‌ها
    if (!serviceId || !text) {
      return NextResponse.json(
        { success: false, error: 'serviceId و text الزامی هستند' },
        { status: 400 }
      );
    }

    // ۲. پیدا کردن سرویس درخواستی
    const service = nlpServices.find(s => s.id === serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: `سرویس با شناسه ${serviceId} یافت نشد` },
        { status: 404 }
      );
    }

    // ۳. اعتبارسنجی طول متن (اختیاری)
    if (text.length > 10000) {
      return NextResponse.json(
        { success: false, error: 'طول متن نباید از ۱۰,۰۰۰ کاراکتر بیشتر باشد' },
        { status: 400 }
      );
    }

    // ۴. 🔥 ارسال واقعی درخواست به سرویس داخلی (Flask)
    console.log(`🚀 Gateway: ارسال درخواست به ${service.internalUrl}`);
    const startTime = Date.now();

    const internalResponse = await fetch(service.internalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }), // Flask شما {"text": "..."} انتظار دارد
    });

    const processingTime = Date.now() - startTime;

    // ۵. بررسی پاسخ سرویس داخلی
    if (!internalResponse.ok) {
      const errorText = await internalResponse.text();
      throw new Error(`سرویس داخلی خطا داد (${internalResponse.status}): ${errorText}`);
    }

    const resultData = await internalResponse.json();

    // ۶. بازگرداندن پاسخ موفق به کاربر
    return NextResponse.json({
      success: true,
      data: resultData, // پاسخ مستقیم از Flask
      service: service.name,
      processingTime: processingTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Gateway POST Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطای ناشناخته';
    return NextResponse.json(
      {
        success: false,
        error: 'خطای داخلی سرور در Gateway',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// GET برای دریافت لیست سرویس‌ها (بدون تغییر)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let filteredServices = nlpServices;
    if (category) {
      filteredServices = filteredServices.filter(s => s.category === category);
    }
    if (status) {
      filteredServices = filteredServices.filter(s => s.status === status);
    }

    return NextResponse.json({
      success: true,
      count: filteredServices.length,
      services: filteredServices,
      stats: {
        total: nlpServices.length,
        byCategory: nlpServices.reduce((acc, service) => {
          acc[service.category] = (acc[service.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: nlpServices.reduce((acc, service) => {
          acc[service.status] = (acc[service.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    );
  }
}

// Health Check (بدون تغییر)
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'X-API-Status': 'healthy',
      'X-API-Version': '3.0.0',
      'X-Service-Count': nlpServices.length.toString()
    }
  });
}
