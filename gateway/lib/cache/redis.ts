export class NLPCache {
  private cache: Map<string, { value: any; expiry: number }>;
  private isConnected: boolean = true;

  constructor() {
    this.cache = new Map();
    console.log('✅ Memory Cache initialized');
  }

  // ایجاد کلید کش
  private generateCacheKey(serviceId: string, text: string, options?: any): string {
    const hash = this.simpleHash(text + JSON.stringify(options || {}));
    return `nlp:${serviceId}:${hash}`;
  }

  // هش ساده برای متن
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // ذخیره در کش
  async set(serviceId: string, text: string, result: any, options?: any, ttl: number = 3600): Promise<void> {
    const key = this.generateCacheKey(serviceId, text, options);
    const expiry = Date.now() + (ttl * 1000);
    
    this.cache.set(key, {
      value: result,
      expiry
    });

    // پاکسازی خودکار آیتم‌های منقضی شده
    this.cleanup();
  }

  // بازیابی از کش
  async get(serviceId: string, text: string, options?: any): Promise<any | null> {
    const key = this.generateCacheKey(serviceId, text, options);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // بررسی انقضا
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  // پاک کردن کش یک سرویس
  async invalidateService(serviceId: string): Promise<void> {
    const pattern = `nlp:${serviceId}:`;
    
    for (const [key] of this.cache) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // پاکسازی آیتم‌های منقضی شده
  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.cache) {
      if (now > data.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // آمار کش
  async getStats(): Promise<{ hits: number; misses: number; size: number }> {
    return {
      hits: 0,
      misses: 0,
      size: this.cache.size
    };
  }

  // پاک کردن کل کش
  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// نمونه Singleton
export const nlpCache = new NLPCache();
