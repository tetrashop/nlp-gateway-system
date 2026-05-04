#!/bin/bash

echo "🔧 Fixing NLP Gateway..."

# 1. کشتن همه فرآیندهای قدیمی
echo "Stopping old processes..."
pkill -9 -f "python server.py"
pkill -9 -f "nohup python"
sleep 1

# 2. پاک کردن فایل‌های موقت
echo "Cleaning temp files..."
rm -f ~/nlp-gateway/server.pid

# 3. دادن مجوز اجرا به اسکریپت‌ها
chmod +x ~/nlp-gateway/manage.sh

# 4. راه‌اندازی مجدد
echo "Starting fresh..."
cd ~/nlp-gateway
./manage.sh start

# 5. نمایش وضعیت
sleep 2
./manage.sh status
