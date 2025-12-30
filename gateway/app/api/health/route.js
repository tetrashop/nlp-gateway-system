import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const detailed = url.searchParams.get('detailed') === 'true';
  
  const statusInfo = {
    status: 'operational',
    service: 'nlp-gateway-health',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    
    system: {
      node: process.version,
      platform: process.platform,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`
      },
      cpu: process.cpuUsage()
    },
    
    services: {
      gateway: { status: 'online', path: '/api/v1' },
      auth: { status: process.env.AUTH_SERVICE_URL ? 'configured' : 'not_configured' },
      ai: { status: process.env.AI_SERVICE_URL ? 'configured' : 'not_configured' },
      database: { status: process.env.DATABASE_URL ? 'configured' : 'not_configured' },
      cache: { status: process.env.REDIS_URL ? 'configured' : 'not_configured' }
    },
    
    environment: process.env.NODE_ENV || 'development',
    
    endpoints: [
      { path: '/', description: 'داشبورد اصلی', status: 'active' },
      { path: '/api/v1', description: 'Gateway ریشه', status: 'active' },
      { path: '/api/v1/{service}', description: 'Gateway سرویس‌ها', status: 'active' },
      { path: '/api/health', description: 'وضعیت سلامت', status: 'active' },
      { path: '/api/test', description: 'سرویس تست', status: 'active' }
    ]
  };

  // اگر درخواست جزئیات کامل باشد
  if (detailed) {
    statusInfo.detailed = {
      env_vars: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_AUTH_URL: !!process.env.AUTH_SERVICE_URL,
        HAS_AI_URL: !!process.env.AI_SERVICE_URL,
        HAS_DB_URL: !!process.env.DATABASE_URL
      },
      process: {
        pid: process.pid,
        arch: process.arch,
        cwd: process.cwd(),
        execPath: process.execPath
      }
    };
  }

  // اگر فرمت text باشد
  if (format === 'text') {
    const textResponse = `
NLP Gateway Health Status
=========================
Status: ${statusInfo.status}
Version: ${statusInfo.version}
Uptime: ${Math.floor(statusInfo.uptime)} seconds
Timestamp: ${new Date(statusInfo.timestamp).toLocaleString('fa-IR')}

Services Status:
${Object.entries(statusInfo.services).map(([key, val]) => `  ${key}: ${val.status}`).join('\n')}

Active Endpoints:
${statusInfo.endpoints.map(e => `  ${e.path} - ${e.description}`).join('\n')}
    `.trim();

    return new NextResponse(textResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  return NextResponse.json(statusInfo);
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Health-Check': 'available',
      'X-Gateway-Version': '1.0.0',
      'X-Uptime': `${process.uptime()}`
    }
  });
}
