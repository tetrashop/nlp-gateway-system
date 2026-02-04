#!/bin/bash

echo "🤖 به‌روزرسانی خودکار تعداد پست‌ها"
echo "================================="

cd ~/nlp-gateway-final

# خواندن تعداد واقعی پست‌ها از فایل posts.json
REAL_POST_COUNT=$(grep -o '"id"' posts.json | wc -l)
echo "📊 تعداد واقعی پست‌ها در فایل: $REAL_POST_COUNT"

# بررسی فایل simple-gateway.js
echo "🔍 بررسی فایل سرور..."
CURRENT_MESSAGE=$(grep -o '"message":"[^"]*"' simple-gateway.js | head -1)

if [[ $CURRENT_MESSAGE == *"$REAL_POST_COUNT"* ]]; then
    echo "✅ پیام خوش‌آمدگویی به‌روز است."
else
    echo "🔄 به‌روزرسانی پیام خوش‌آمدگویی..."
    
    # تبدیل اعداد انگلیسی به فارسی
    FA_NUM=$(echo $REAL_POST_COUNT | sed 's/0/۰/g; s/1/۱/g; s/2/۲/g; s/3/۳/g; s/4/۴/g; s/5/۵/g; s/6/۶/g; s/7/۷/g; s/8/۸/g; s/9/۹/g')
    
    # جایگزینی در فایل
    sed -i "s/\"message\":\"[^\"]*\"/\"message\":\"🚀 خوش آمدید به سیستم پردازش $FA_NUM پست NLP\"/g" simple-gateway.js
    sed -i "s/\"description\":\"[^\"]*\"/\"description\":\"سیستم پردازش زبان طبیعی با $FA_NUM پست تخصصی\"/g" simple-gateway.js
    
    echo "✅ پیام به‌روزرسانی شد به: $FA_NUM پست"
    
    # راه‌اندازی مجدد سرور
    echo "🔄 راه‌اندازی مجدد سرور..."
    ./nlp-manager.sh stop > /dev/null 2>&1
    sleep 2
    ./nlp-manager.sh start > /dev/null 2>&1
    sleep 3
fi

# نمایش نتیجه
echo ""
echo "🎯 نتیجه نهایی:"
curl -s http://localhost:1680/ | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'📝 {data.get(\"message\", \"\")}')
print(f'📋 {data.get(\"description\", \"\")}')
"
