import { createProxyMiddleware } from 'http-proxy-middleware';

const imageProxy = createProxyMiddleware({
  target: 'http://localhost:5003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/image2dto3d': '/api/convert',
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
    return res.status(405).json({ error: 'متد POST مورد نیاز است' });
  }
  imageProxy(req, res);
}
