#!/usr/bin/env python3
import json, datetime, os, re, socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from app.handlers.sentiment import analyzer
from app.handlers.translator import translator
from app.database import save_request, get_api_keys, get_cache, set_cache
from app.documentation import get_documentation_html
from search_engine import search_posts

API_KEYS = {'test-key-123': 'default_user', 'admin-key': 'admin'}

def check_auth(headers):
    api_key = headers.get('X-API-Key')
    return (api_key and api_key in API_KEYS), API_KEYS.get(api_key)

class NLPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/dashboard.html':
            try:
                with open('dashboard.html', 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html')
                    self.end_headers()
                    self.wfile.write(f.read())
                return
            except FileNotFoundError:
                self.send_error(404)
                return
        if self.path == '/health':
            self._send_json(200, {'status': 'ok', 'version': '8.0'})
        elif self.path.startswith('/api/search'):
            from urllib.parse import urlparse, parse_qs
            q = parse_qs(urlparse(self.path).query).get('q', [''])[0]
            results = search_posts(q)
            self._send_json(200, {'results': results})
        else:
            self.send_error(404)

    def do_POST(self):
        is_auth, _ = check_auth(self.headers)
        if not is_auth:
            self._send_json(401, {'error': 'Invalid API key'})
            return
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body) if body else {}
            if self.path == '/v1/sentiment':
                result = analyzer.analyze(data.get('text', ''), self.client_address[0])
                self._send_json(200, result)
            elif self.path == '/v1/translate':
                result = translator.translate(data.get('text',''), data.get('source','auto'), data.get('target','en'))
                self._send_json(200, result)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, str(e))

    def _send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

def run():
    host, port = '0.0.0.0', 1681
    HTTPServer((host, port), NLPHandler).serve_forever()

if __name__ == '__main__':
    run()
