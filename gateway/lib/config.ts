// تنظیمات اصلی گیت‌وی NLP

export const CONFIG = {
  // تنظیمات سرور
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    clusterMode: process.env.CLUSTER_MODE === 'true',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
  },

  // تنظیمات سرویس‌های NLP
  nlpServices: {
    defaultRateLimit: 1000,
    maxTextLength: 10000,
    cacheTTL: 3600, // 1 hour
    timeout: 30000, // 30 seconds
    retryAttempts: 3
  },

  // تنظیمات احراز هویت
  auth: {
    apiKeyHeader: 'x-api-key',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    tokenExpiry: '24h',
    requireAuth: process.env.REQUIRE_AUTH !== 'false'
  },

  // تنظیمات Rate Limiting
  rateLimiting: {
    enabled: true,
    defaultLimit: 1000,
    burstCapacity: 1100,
    windowMs: 60 * 60 * 1000, // 1 hour
    trustProxy: true
  },

  // تنظیمات کش
  caching: {
    enabled: true,
    type: process.env.CACHE_TYPE || 'memory', // memory, redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    defaultTTL: 3600
  },

  // تنظیمات Load Balancing
  loadBalancing: {
    enabled: true,
    algorithm: 'round-robin', // round-robin, least-connections, weighted
    healthCheckInterval: 30000, // 30 seconds
    failoverThreshold: 3
  },

  // تنظیمات Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE || './logs/nlp-gateway.log',
    maxFileSize: '10m',
    maxFiles: '10'
  },

  // تنظیمات مانیتورینگ
  monitoring: {
    enabled: true,
    metricsPort: process.env.METRICS_PORT || 9090,
    healthCheckEndpoint: '/health',
    metricsEndpoint: '/metrics',
    alertWebhook: process.env.ALERT_WEBHOOK
  },

  // تنظیمات دیتابیس (اگر نیاز باشد)
  database: {
    enabled: process.env.DB_ENABLED === 'true',
    url: process.env.DATABASE_URL,
    type: process.env.DB_TYPE || 'postgres'
  },

  // تنظیمات ایمیل و نوتیفیکیشن
  notifications: {
    emailEnabled: process.env.EMAIL_ENABLED === 'true',
    smsEnabled: process.env.SMS_ENABLED === 'true',
    slackWebhook: process.env.SLACK_WEBHOOK
  }
};

// تابع برای دریافت تنظیمات بر اساس محیط
export function getConfig(env: string = process.env.NODE_ENV || 'development') {
  const baseConfig = { ...CONFIG };

  if (env === 'production') {
    return {
      ...baseConfig,
      server: {
        ...baseConfig.server,
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || []
      },
      auth: {
        ...baseConfig.auth,
        requireAuth: true
      },
      logging: {
        ...baseConfig.logging,
        level: 'warn'
      }
    };
  }

  if (env === 'test') {
    return {
      ...baseConfig,
      rateLimiting: {
        ...baseConfig.rateLimiting,
        enabled: false
      },
      caching: {
        ...baseConfig.caching,
        enabled: false
      },
      logging: {
        ...baseConfig.logging,
        level: 'error'
      }
    };
  }

  return baseConfig;
}

// تابع برای اعتبارسنجی تنظیمات
export function validateConfig() {
  const errors: string[] = [];

  if (!CONFIG.auth.jwtSecret && CONFIG.auth.requireAuth) {
    errors.push('JWT_SECENT باید در محیط production تنظیم شود');
  }

  if (CONFIG.caching.enabled && CONFIG.caching.type === 'redis' && !CONFIG.caching.redisUrl) {
    errors.push('REDIS_URL باید برای کش Redis تنظیم شود');
  }

  if (errors.length > 0) {
    throw new Error(`خطا در تنظیمات: \n${errors.join('\n')}`);
  }

  return true;
}

// تابع برای دریافت مقدار از متغیرهای محیطی با fallback
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (value === undefined || value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`متغیر محیطی ${key} تنظیم نشده است`);
  }
  
  return value;
}

// تابع برای بررسی حالت توسعه
export function isDevelopment(): boolean {
  return CONFIG.server.environment === 'development';
}

// تابع برای بررسی حالت production
export function isProduction(): boolean {
  return CONFIG.server.environment === 'production';
}

// مقداردهی اولیه
try {
  validateConfig();
  console.log('✅ تنظیمات با موفقیت بارگذاری شد');
} catch (error) {
  console.error('❌ خطا در تنظیمات:', error.message);
  process.exit(1);
}
