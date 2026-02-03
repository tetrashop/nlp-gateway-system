import { createProxyMiddleware } from 'http-proxy-middleware';

const chessProxy = createProxyMiddleware({
  target: 'http://localhost:5004',
  changeOrigin: true,
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true,
  },
};

export default function handler(req, res) {
  chessProxy(req, res);
}
