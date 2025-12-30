import { NextRequest, NextResponse } from 'next/server';

const API_KEYS = new Map<string, { rateLimit: number; used: number }>();

export async function authMiddleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || 
                 request.nextUrl.searchParams.get('api_key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key الزامی است' },
      { status: 401 }
    );
  }

  // بررسی وجود API Key
  if (!API_KEYS.has(apiKey)) {
    return NextResponse.json(
      { error: 'API Key نامعتبر است' },
      { status: 403 }
    );
  }

  const keyData = API_KEYS.get(apiKey)!;
  
  // بررسی Rate Limit
  if (keyData.used >= keyData.rateLimit) {
    return NextResponse.json(
      { 
        error: 'محدودیت درخواست رخ داده است',
        resetTime: 'در یک ساعت آینده'
      },
      { status: 429 }
    );
  }

  // افزایش شمارنده درخواست
  keyData.used += 1;
  API_KEYS.set(apiKey, keyData);

  // افزودن اطلاعات کاربر به هدر
  const headers = new Headers(request.headers);
  headers.set('x-api-key-data', JSON.stringify(keyData));

  return NextResponse.next({
    request: {
      headers
    }
  });
}

// تابع برای اضافه کردن API Key جدید
export function addApiKey(key: string, rateLimit: number = 1000) {
  API_KEYS.set(key, { rateLimit, used: 0 });
}

// تابع برای دریافت وضعیت API Key
export function getApiKeyStatus(key: string) {
  return API_KEYS.get(key);
}
