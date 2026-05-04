#!/bin/bash
set -e
echo "🚀 شروع به‌روزرسانی NLP Gateway (نسخه Python)..."

# 1. داشبورد مدیریت
echo "📊 [1/8] افزودن داشبورد مدیریت وب..."
cat > dashboard.html << 'HTM'
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="UTF-8"><title>داشبورد NLP Gateway</title>
<style>body{font-family:Tahoma;background:#f0f2f5;padding:20px;}</style>
</head>
<body>
<h1>🚀 NLP Gateway - داشبورد مدیریت</h1>
<div id="status">در حال بارگذاری...</div>
<script>
fetch('/api/health').then(r=>r.json()).then(d=>{
    document.getElementById('status').innerHTML = `
        <p>وضعیت: ${d.status}</p>
        <p>تعداد پست‌ها: ${d.postsCount || 'نامشخص'}</p>
        <p>آپ‌تایم: ${d.uptime || '-'} ثانیه</p>
    `;
}).catch(e=>document.getElementById('status').innerText='خطا در ارتباط با سرور');
</script>
</body>
</html>
HTM

# 2. اتصال به ربات بله
echo "🤖 [2/8] افزودن اتصال به ربات بله..."
cat > bale_bot.py << 'PY'
import requests, json, sys
BOT_TOKEN = "YOUR_BALE_TOKEN"
BASE_URL = f"https://api.bale.ai/v1/bot{BOT_TOKEN}/"
def send_message(chat_id, text):
    requests.post(BASE_URL+"sendMessage", json={"chat_id":chat_id,"text":text})
def handle_message(chat_id, msg):
    try:
        resp = requests.post("http://localhost:1680/api/sentiment", json={"text":msg})
        sentiment = resp.json().get("sentiment","نامشخص")
        summary_resp = requests.post("http://localhost:1680/api/summarize", json={"text":msg,"num_sentences":1})
        summary = summary_resp.json().get("summary","")
        reply = f"احساسات: {sentiment}\nخلاصه: {summary}"
        send_message(chat_id, reply)
    except: send_message(chat_id, "خطا در تحلیل پیام")
if __name__ == "__main__":
    print("ربات بله راه‌اندازی شد (توکن را تنظیم کنید)")
PY

# 3. موتور جستجو
echo "🔍 [4/8] افزودن موتور جستجو..."
cat > search_engine.py << 'PY'
import os, glob
def search_posts(query, posts_dir="posts"):
    if not os.path.exists(posts_dir):
        return []
    results = []
    for file in glob.glob(f"{posts_dir}/*.txt") + glob.glob(f"{posts_dir}/*.md"):
        with open(file, encoding='utf-8') as f:
            content = f.read()
            if query.lower() in content.lower():
                title = os.path.basename(file)
                snippet = content[:150].replace("\n"," ") + "..."
                results.append({"title":title, "snippet":snippet})
    return results
PY

# 4. Docker
echo "🐳 [5/8] افزودن Dockerfile و docker-compose.yml..."
cat > Dockerfile << 'DOCK'
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 1680
CMD ["python", "server.py"]
DOCK
cat > docker-compose.yml << 'YML'
version: '3'
services:
  nlp-gateway:
    build: .
    ports:
      - "1680:1680"
    restart: unless-stopped
YML

# 5. تبدیل صدا به متن (آفلاین با pocketsphinx)
echo "🎤 [6/8] افزودن تشخیص صدا (pocketsphinx)..."
pkg install pocketsphinx -y 2>/dev/null || echo "pocketsphinx ممکن است نصب نشده باشد"
cat > speech2text.py << 'PY'
import subprocess, tempfile, os
def transcribe_audio(file_path):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(open(file_path,'rb').read())
        tmp_path = tmp.name
    out = subprocess.check_output(["pocketsphinx_continuous", "-infile", tmp_path, "-logfn", "/dev/null"], text=True)
    os.unlink(tmp_path)
    return out.strip()
PY

# 6. پشتیبانی PostgreSQL (اختیاری)
echo "🗄️ [7/8] افزودن db_pg.py (در صورت نیاز)..."
cat > db_pg.py << 'PG'
import psycopg2, os
def get_conn():
    return psycopg2.connect(
        host=os.getenv("PGHOST","localhost"),
        database=os.getenv("PGDATABASE","nlp_gateway"),
        user=os.getenv("PGUSER","postgres"),
        password=os.getenv("PGPASSWORD","postgres")
    )
PG

# 7. بکاپ به ابر
echo "☁️ [8/8] افزودن اسکریپت بکاپ ابری..."
cat > backup_cloud.sh << 'SH'
#!/bin/bash
BACKUP_FILE="/tmp/nlp-gateway-backup-$(date +%Y%m%d).tar.gz"
tar -czf $BACKUP_FILE ~/nlp-gateway
if command -v rclone &>/dev/null; then
    rclone copy $BACKUP_FILE remote:nlp-gateway-backups/
    echo "بکاپ ارسال شد"
else
    echo "rclone نصب نیست. بکاپ محلی: $BACKUP_FILE"
fi
SH
chmod +x backup_cloud.sh

# 8. به‌روزرسانی server.py با APIهای جدید
echo "🔄 به‌روزرسانی server.py ..."
cp server.py server.py.bak
# اضافه کردن importها و endpointها
if ! grep -q "from search_engine import search_posts" server.py; then
    sed -i '/^import /a from search_engine import search_posts\nfrom bale_bot import handle_message  # optional\nimport subprocess, tempfile' server.py
fi
# اضافه کردن endpoint /api/search
if ! grep -q "/api/search" server.py; then
    sed -i '/def do_GET():/a \        if self.path.startswith("/api/search"):\n            from urllib.parse import urlparse, parse_qs\n            q = parse_qs(urlparse(self.path).query).get("q", [""])[0]\n            results = search_posts(q)\n            self._send_json(200, {"results": results})\n            return' server.py
fi
# اضافه کردن endpoint /api/summarize (اگر نبود)
if ! grep -q "/api/summarize" server.py; then
    sed -i '/def do_POST():/a \        if self.path == "/api/summarize":\n            data = self._parse_body()\n            text = data.get("text", "")\n            sentences = text.split(".")\n            summary = ". ".join(sentences[:data.get("num_sentences", 2)])\n            self._send_json(200, {"summary": summary})\n            return' server.py
fi

# اضافه کردن متد _parse_body در صورت نبود (برای POST)
if ! grep -q "def _parse_body" server.py; then
    cat >> server.py << 'ADDMETHOD'
    def _parse_body(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        return json.loads(body) if body else {}
ADDMETHOD
fi

# راه‌اندازی مجدد سرور
echo "🔄 راه‌اندازی مجدد سرور..."
pkill -f "python server.py" || true
nohup python server.py > server.log 2>&1 &
sleep 2
if curl -s http://localhost:1680/api/health >/dev/null; then
    echo "✅ سرور با موفقیت روی پورت 1680 اجرا شد"
else
    echo "⚠️ سرور روی پورت 1680 پاسخ نداد. ممکن است روی پورت دیگری اجرا شده باشد."
    echo "لاگ: tail -20 server.log"
fi

echo ""
echo "=============================================="
echo "✅ به‌روزرسانی کامل شد! قابلیت‌های جدید:"
echo "📊 داشبورد: http://localhost:1680/dashboard.html"
echo "🔍 جستجو: http://localhost:1680/api/search?q=word"
echo "🤖 ربات بله: توکن را در bale_bot.py تنظیم کنید"
echo "☁️ بکاپ ابری: ./backup_cloud.sh"
echo "🐳 Docker: docker-compose up -d"
echo "=============================================="
