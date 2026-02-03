import { createProxyMiddleware } from 'http-proxy-middleware';

const chessProxy = createProxyMiddleware({
  target: 'http://localhost:5004',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('خطا در ارتباط با سرویس شطرنج:', err.message);
    res.status(502).json({
      success: false,
      error: 'سرویس شطرنج در دسترس نیست',
      service: 'chess-service-base'
    });
  },
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true, // درخواست‌های شطرنج معمولاً JSON هستند
  },
};

export default function handler(req, res) {
  // مسیرهای مختلف سرویس شطرنج
  const pathMap = {
    'POST:/api/chess/move': '/api/move',
    'POST:/api/chess/new-game': '/api/new-game',
  };
  
  const key = `${req.method}:${req.url}`;
  if (pathMap[key]) {
    req.url = pathMap[key];
  }
  
  chessProxy(req, res);
}
