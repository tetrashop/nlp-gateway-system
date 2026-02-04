#!/bin/bash

echo "🔄 اصلاح جامع تمام ارجاعات به تعداد پست‌ها..."
echo ""

# ایجاد نسخه پشتیبان
BACKUP_FILE="simple-gateway.js.backup.$(date +%Y%m%d_%H%M%S)"
cp simple-gateway.js "$BACKUP_FILE"
echo "📁 نسخه پشتیبان ایجاد شد: $BACKUP_FILE"

# اصلاحات
echo "🔧 در حال اعمال اصلاحات..."

# 1. اصلاح پیام خوش‌آمدگویی اصلی
sed -i 's/"۱۶۸ پست NLP"/"۱۶۹ پست NLP"/g' simple-gateway.js
sed -i 's/"168 پست NLP"/"169 پست NLP"/g' simple-gateway.js

# 2. اصلاح توضیحات
sed -i 's/"۱۶۸ پست تخصصی"/"۱۶۹ پست تخصصی"/g' simple-gateway.js
sed -i 's/"168 پست تخصصی"/"169 پست تخصصی"/g' simple-gateway.js

# 3. اصلاح endpoint سلامت (اگر hard-coded شده)
sed -i 's/"posts": 168/"posts": 169/g' simple-gateway.js
sed -i 's/"posts":168/"posts":169/g' simple-gateway.js

# 4. بررسی سایر ارجاعات عددی
echo "🔍 جستجوی سایر ارجاعات به 168:"
grep -n "168" simple-gateway.js

echo ""
echo "✅ اصلاحات اعمال شد."

# راه‌اندازی مجدد
echo "🔄 راه‌اندازی مجدد سرور..."
./nlp-manager.sh stop > /dev/null 2>&1
sleep 2
./nlp-manager.sh start > /dev/null 2>&1
sleep 3

echo ""
echo "🧪 تست نهایی..."
curl -s http://localhost:1680/ | python3 -c "
import json, sys
data = json.load(sys.stdin)
msg = data.get('message', '')
desc = data.get('description', '')

print('📊 نتایج:')
print(f'پیام: {msg}')
print(f'توضیحات: {desc}')

if '۱۶۹' in msg or '169' in msg:
    print('🎉 موفق! سیستم اکنون 169 پست را نمایش می‌دهد.')
else:
    print('⚠️  هنوز نیاز به اصلاح دارد.')
"
