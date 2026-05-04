#!/usr/bin/env python3
import json
import datetime
import os
import csv
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from app.handlers.sentiment import analyzer

# ---------- پیکربندی ----------
LOG_FILE = 'requests.jsonl'
CSV_FILE = 'requests.csv'
API_KEYS = {'test-key-123': 'user1', 'admin-key': 'admin'}

def find_free_port():
    """پیدا کردن یک پورت آزاد به صورت خودکار"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

# ---------- توابع کمکی ----------
def log_request(endpoint, input_data, output_data, client_ip, api_key):
    log_entry = {
        'timestamp': datetime.datetime.now().isoformat(),
        'endpoint': endpoint,
        'client_ip': client_ip,
        'api_key': api_key[:10] if api_key else 'none',
        'input': input_data if isinstance(input_data, str) else json.dumps(input_data, ensure_ascii=False),
        'output': json.dumps(output_data, ensure_ascii=False)
    }
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

def check_auth(headers):
    api_key = headers.get('X-API-Key')
    if not api_key:
        return False, None
    if api_key in API_KEYS:
        return True, API_KEYS[api_key]
    return False, None

# ---------- هندلر سرور ----------
class NLPHandler(BaseHTTPRequestHandler):
    def get_client_ip(self):
        return self.headers.get('X-Forwarded-For', self.client_address[0])
    
    def do_POST(self):
        client_ip = self.get_client_ip()
        is_auth, user = check_auth(self.headers)
        if not is_auth and self.path != '/health':
            self._send_json(401, {'error': 'Invalid or missing API key'})
            return
        
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body) if body else {}
            format_type = self.headers.get('Accept', 'application/json')
            
            # پردازش درخواست‌ها (خلاصه برای اختصار، تمام endpointهای قبلی اینجا قرار دارند)
            if self.path == '/v1/sentiment':
                text = data.get('text', '')
                if not text:
                    self.send_error(400, 'Missing text')
                    return
                result = analyzer.analyze(text, client_ip)
                log_request('/v1/sentiment', text, result, client_ip, self.headers.get('X-API-Key', ''))
                self._send_json(200, result)
            elif self.path == '/health':
                self._send_json(200, {'status': 'ok', 'version': '5.1', 'cache_size': len(analyzer.cache)})
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, str(e))
    
    def _send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

# ---------- اجرا ----------
def run():
    port = find_free_port()  # پیدا کردن پورت آزاد
    host = '0.0.0.0'
    server = HTTPServer((host, port), NLPHandler)
    print(f'🚀 NLP Gateway v5.1 running on http://{host}:{port}')
    print(f'🔑 API Key Required: test-key-123')
    print(f'📝 Logs saved in {LOG_FILE}')
    print('='*50)
    server.serve_forever()

if __name__ == '__main__':
    run()
