import re

with open('server.py', 'r') as f:
    content = f.read()

# الگوی متد do_GET تا انتهای indent آن
# ما یک نسخه جدید می‌سازیم که اول استاتیک را چک کند
new_do_get = '''
    def do_GET(self):
        # ابتدا بررسی فایل استاتیک
        if self.serve_static_file(self.path):
            return
        # سپس سایر endpointهای GET
        if self.path == '/health':
            self._send_json(200, {'status': 'ok', 'version': '8.0', 'timestamp': datetime.datetime.now().isoformat()})
        elif self.path == '/docs':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(get_documentation_html().encode('utf-8'))
        else:
            self.send_error(404)
'''

# حذف do_GET قدیمی و جایگزینی
pattern = r'    def do_GET\(self\):.*?(?=\n    def [a-zA-Z_])'
content = re.sub(pattern, new_do_get, content, flags=re.DOTALL)

with open('server.py', 'w') as f:
    f.write(content)
print("✅ server.py اصلاح شد")
