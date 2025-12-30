/**
 * ماژول اصلی Gateway
 */

// کش در حافظه (در تولید از Redis استفاده کنید)
const requestCache = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 3600;

/**
 * اعتبارسنجی توکن کاربر
 */
export async function validateToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, userId: null };
    }
    
    const token = authHeader.split(' ')[1];
    
    // در اینجا باید منطق اعتبارسنجی توکن را پیاده‌سازی کنید
    // می‌توانید از یک سرویس auth داخلی یا JWT استفاده کنید
    
    // مثال ساده:
    // const response = await fetch(`${process.env.AUTH_SERVICE_URL}/verify`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    // برای نمونه، یک اعتبارسنجی ساده
    const isValid = token && token.length > 10;
    
    return {
      valid: isValid,
      userId: isValid ? extractUserIdFromToken(token) : null,
      token: isValid ? token : null
    };
    
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, userId: null };
  }
}

function extractUserIdFromToken(token) {
  // در واقعیت باید payload JWT را decode کنید
  // این یک نمونه ساده است
  try {
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return payload.userId || payload.sub;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * لاگ درخواست‌ها
 */
export async function logRequest(method, path, userId = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method,
    path,
    userId,
    ip: '127.0.0.1'
  };
  
  // در اینجا لاگ را به فایل یا سرویس لاگ ارسال کنید
  console.log('API Gateway Request:', logEntry);
  
  return logEntry;
}

/**
 * مدیریت کش
 */
export function getFromCache(key) {
  const cached = requestCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL * 1000) {
    requestCache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setToCache(key, data, ttl = CACHE_TTL) {
  requestCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
  
  // محدود کردن اندازه کش
  if (requestCache.size > (process.env.MAX_CACHE_SIZE || 1000)) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }
}

export function clearCache() {
  requestCache.clear();
}
