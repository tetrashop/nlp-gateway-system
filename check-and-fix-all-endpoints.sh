#!/bin/bash

echo "🔍 بررسی کامل تمام endpointها..."
echo ""

# 1. بررسی endpoint اصلی
echo "1. بررسی endpoint اصلی (/):"
curl -s http://localhost:1680/ | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('   ✅ پاسخ دریافت شد')
    print(f'   📝 پیام: {data.get(\"message\", \"پیام یافت نشد\")}')
    print(f'   📊 توضیحات: {data.get(\"description\", \"توضیحی یافت نشد\")}')
    
    # بررسی تعداد پست‌ها در پیام
    if '۱۶۹' in data.get('message', '') or '169' in data.get('message', ''):
        print('   🎯 تعداد پست‌ها صحیح است (169)')
    else:
        print('   ⚠️  نیاز به اصلاح تعداد پست‌ها')
        
except Exception as e:
    print(f'   ❌ خطا: {e}')
"

echo ""

# 2. بررسی endpoint آمار
echo "2. بررسی endpoint آمار (/api/stats):"
curl -s http://localhost:1680/api/stats | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    posts = data.get('totalPosts', 0)
    words = data.get('totalWords', 0)
    
    print(f'   📊 پست‌ها: {posts}')
    print(f'   🔤 کلمات: {words}')
    
    if posts == 169:
        print('   ✅ تعداد پست‌ها صحیح است')
    else:
        print(f'   ❌ تعداد پست‌ها نادرست است (انتظار 169، دریافت {posts})')
        
except Exception as e:
    print(f'   ❌ خطا: {e}')
"

echo ""

# 3. بررسی endpoint سلامت
echo "3. بررسی endpoint سلامت (/api/health):"
curl -s http://localhost:1680/api/health | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    status = data.get('status', '')
    posts = data.get('posts', 0)
    
    print(f'   🩺 وضعیت: {status}')
    print(f'   📝 پست‌ها: {posts}')
    
    if posts == 169:
        print('   ✅ تعداد پست‌ها در سلامت صحیح است')
    else:
        print(f'   ⚠️  نیاز به اصلاح تعداد پست‌ها در سلامت')
        
except Exception as e:
    print(f'   ❌ خطا: {e}')
"
