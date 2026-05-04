# NLP Gateway - راهنمای سریع

## بازیابی پروژه (اگر پاک شد)
```bash
cd ~
tar -xzvf /sdcard/Download/nlp-gateway-backup.tar.gz
cd nlp-gateway
```

اجرا

```bash
cd ~/nlp-gateway
python server.py
```

اجرا در پس‌زمینه (دائمی)

```bash
nohup python server.py > server.log 2>&1 &
echo $! > server.pid
```

بررسی سلامت

```bash
curl -H "X-API-Key: test-key-123" http://127.0.0.1:PORT/health
```

API Key پیش‌فرض

test-key-123

توقف سرور

```bash
pkill -f server.py
```

نیازمندی‌ها

· Python 3.12 (Termux)
· بدون نیاز به اینترنت
· پورت خودکار انتخاب می‌شود

تاریخ: 2026-04-30
