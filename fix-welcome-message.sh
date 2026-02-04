#!/bin/bash

echo "🔧 به‌روزرسانی پیام خوش‌آمدگویی..."

# ایجاد نسخه پشتیبان
cp simple-gateway.js simple-gateway.js.backup.$(date +%Y%m%d_%H%M%S)

# اصلاح پیام 168 به 169
sed -i 's/۱۶۸ پست/۱۶۹ پست/g' simple-gateway.js
sed -i 's/168 پست/169 پست/g' simple-gateway.js

# همچنین قسمت description را بررسی می‌کنیم
sed -i 's/"۱۶۸ پست تخصصی"/"۱۶۹ پست تخصصی"/g' simple-gateway.js
sed -i 's/"168 پست تخصصی"/"169 پست تخصصی"/g' simple-gateway.js

echo "✅ پیام خوش‌آمدگویی به‌روزرسانی شد."

# راه‌اندازی مجدد سرور
echo "🔄 راه‌اندازی مجدد سرور..."
./nlp-manager.sh stop > /dev/null 2>&1
sleep 2
./nlp-manager.sh start > /dev/null 2>&1
sleep 3

echo "📡 بررسی تغییرات..."
curl -s http://localhost:1680/ | grep -o '"message":"[^"]*"' | head -1
