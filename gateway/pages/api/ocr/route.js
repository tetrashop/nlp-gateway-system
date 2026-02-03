import { createProxyMiddleware } from 'http-proxy-middleware';

const ocrProxy = createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ocr': '/api/ocr',
  },
  onError: (err, req, res) => {
    console.error('خطا در ارتباط با سرویس OCR:', err.message);
    res.status(502).json({
      success: false,
      error: 'سرویس OCR در دسترس نیست',
      service: 'ocr-service-base'
    });
  },
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'متد POST مورد نیاز است',
      allowed: ['POST']
    });
  }
  ocrProxy(req, res);
}
