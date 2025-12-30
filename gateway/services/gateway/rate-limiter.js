/**
 * Rate Limiter برای Gateway
 */

const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 دقیقه
const MAX_REQUESTS_PER_WINDOW = 100; // حداکثر ۱۰۰ درخواست در دقیقه

/**
 * بررسی محدودیت نرخ برای IP
 */
export async function rateLimiter(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, []);
  }
  
  const requests = rateLimits.get(ip);
  
  // حذف درخواست‌های قدیمی
  const validRequests = requests.filter(time => time > windowStart);
  rateLimits.set(ip, validRequests);
  
  // بررسی تعداد درخواست‌ها
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  // ثبت درخواست جدید
  validRequests.push(now);
  rateLimits.set(ip, validRequests);
  
  return true;
}

/**
 * تنظیم محدودیت برای سرویس خاص
 */
export function setServiceRateLimit(serviceName, maxRequests = 50) {
  // پیاده‌سازی محدودیت بر اساس سرویس
  return async function serviceRateLimiter(ip, service) {
    const key = `${ip}:${service}`;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // ... پیاده‌سازی مشابه
    return true;
  };
}

/**
 * پاک‌سازی دوره‌ای
 */
setInterval(() => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW * 2; // دو برابر window برای اطمینان
  
  for (const [ip, requests] of rateLimits.entries()) {
    const validRequests = requests.filter(time => time > windowStart);
    if (validRequests.length === 0) {
      rateLimits.delete(ip);
    } else {
      rateLimits.set(ip, validRequests);
    }
  }
}, RATE_LIMIT_WINDOW * 5); // هر ۵ دقیقه پاک‌سازی

// اکسپورت تابع اصلی
export default rateLimiter;
