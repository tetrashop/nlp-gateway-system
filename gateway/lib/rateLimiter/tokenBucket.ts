import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  requestsPerHour: number;
  burstCapacity: number;
  clientIdentifier?: string;
}

export class TokenBucketRateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }>;
  private configs: Map<string, RateLimitConfig>;

  constructor() {
    this.buckets = new Map();
    this.configs = new Map();
  }

  // تنظیم کانفیگ برای کلید
  setConfig(key: string, config: RateLimitConfig) {
    this.configs.set(key, config);
    if (!this.buckets.has(key)) {
      this.buckets.set(key, { 
        tokens: config.burstCapacity, 
        lastRefill: Date.now() 
      });
    }
  }

  // پر کردن مجدد توکن‌ها
  private refillBucket(key: string) {
    const config = this.configs.get(key);
    if (!config) return;

    const bucket = this.buckets.get(key);
    if (!bucket) return;

    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = (timePassed / 3600000) * config.requestsPerHour; // هر ساعت

    bucket.tokens = Math.min(config.burstCapacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
    this.buckets.set(key, bucket);
  }

  // بررسی Rate Limit
  async checkRateLimit(request: NextRequest, key: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetAfter: number;
    limit: number;
  }> {
    const config = this.configs.get(key);
    if (!config) {
      return {
        allowed: true,
        remaining: Infinity,
        resetAfter: 0,
        limit: Infinity
      };
    }

    // پر کردن مجدد
    this.refillBucket(key);
    const bucket = this.buckets.get(key)!;

    // بررسی موجودی توکن
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.buckets.set(key, bucket);

      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetAfter: Math.ceil((1 / config.requestsPerHour) * 3600000),
        limit: config.requestsPerHour
      };
    } else {
      return {
        allowed: false,
        remaining: 0,
        resetAfter: Math.ceil((1 / config.requestsPerHour) * 3600000),
        limit: config.requestsPerHour
      };
    }
  }

  // دریافت وضعیت Rate Limit
  getStatus(key: string) {
    this.refillBucket(key);
    const bucket = this.buckets.get(key);
    const config = this.configs.get(key);

    if (!bucket || !config) {
      return null;
    }

    return {
      currentTokens: bucket.tokens,
      burstCapacity: config.burstCapacity,
      requestsPerHour: config.requestsPerHour,
      lastRefill: new Date(bucket.lastRefill).toISOString()
    };
  }

  // ریست Rate Limit برای یک کلید
  reset(key: string) {
    const config = this.configs.get(key);
    if (config) {
      this.buckets.set(key, { 
        tokens: config.burstCapacity, 
        lastRefill: Date.now() 
      });
    }
  }
}

// نمونه Singleton
export const rateLimiter = new TokenBucketRateLimiter();

// Middleware برای Rate Limiting
export async function rateLimitMiddleware(request: NextRequest) {
  // شناسایی کلید کاربر (API Key, IP, User ID)
  const identifier = request.headers.get('x-api-key') || 
                    request.ip || 
                    'anonymous';

  const result = await rateLimiter.checkRateLimit(request, identifier);

  if (!result.allowed) {
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.resetAfter.toString());
    headers.set('Retry-After', result.resetAfter.toString());

    return new Response(
      JSON.stringify({
        error: 'محدودیت نرخ درخواست',
        message: 'تعداد درخواست‌های شما از حد مجاز بیشتر شده است',
        retryAfter: result.resetAfter
      }),
      {
        status: 429,
        headers
      }
    );
  }

  // افزودن هدرهای Rate Limit به پاسخ
  const headers = new Headers(request.headers);
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.resetAfter.toString());

  return NextResponse.next({
    request: {
      headers
    }
  });
}
