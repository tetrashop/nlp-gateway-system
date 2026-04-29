#!/usr/bin/env python3
# server.py - NLP Gateway بدون هیچ وابستگی خارجی

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import re
import urllib.parse

from app.handlers.sentiment import analyzer

class NLPHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/v1/sentiment':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body)
                text = data.get('text', '')
                if not text:
                    self.send_error(400, 'Missing "text" field')
                    return
                result = analyzer.analyze(text)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            except json.JSONDecodeError:
                self.send_error(400, 'Invalid JSON')
        else:
            self.send_error(404, 'Not Found')

    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode())
        else:
            self.send_error(404)

def run(host='0.0.0.0', port=8000):
    server = HTTPServer((host, port), NLPHandler)
    print(f'NLP Gateway running on http://{host}:{port}')
    print('Endpoints: POST /v1/sentiment , GET /health')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down...')
        server.shutdown()

if __name__ == '__main__':
    run()
