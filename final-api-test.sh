#!/bin/bash

echo "🧪 تست جامع APIهای سیستم"
echo "========================"
echo ""

ENDPOINTS=(
    "/"
    "/api/posts"
    "/api/stats"
    "/api/health"
    "/api/search/NLP"
    "/api/posts/169"
    "/api/categories"
)

for endpoint in "${ENDPOINTS[@]}"; do
    echo "🔗 ${endpoint}:"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:1680${endpoint}")
    
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ پاسخ 200 OK"
        
        # برای endpointهای خاص، اطلاعات بیشتری نمایش می‌دهیم
        case $endpoint in
            "/")
                echo "   📝 $(curl -s http://localhost:1680/ | grep -o '"message":"[^"]*"' | head -1)"
                ;;
            "/api/stats")
                POSTS=$(curl -s http://localhost:1680/api/stats | grep -o '"totalPosts":[0-9]*' | cut -d: -f2)
                echo "   📊 $POSTS پست"
                ;;
            "/api/health")
                echo "   🩺 $(curl -s http://localhost:1680/api/health | grep -o '"status":"[^"]*"' | cut -d: -f2)"
                ;;
        esac
    else
        echo "   ❌ خطا: $STATUS"
    fi
    echo ""
done

echo "🎯 بررسی نهایی تعداد پست‌ها:"
FINAL_COUNT=$(curl -s http://localhost:1680/api/stats | grep -o '"totalPosts":[0-9]*' | cut -d: -f2)

if [ "$FINAL_COUNT" = "169" ]; then
    echo "✅ سیستم به درستی 169 پست را گزارش می‌دهد!"
    echo ""
    echo "🎉 پروژه کاملاً تکمیل شد!"
else
    echo "⚠️  سیستم $FINAL_COUNT پست را گزارش می‌دهد."
    echo "لطفاً فایل‌ها را بررسی کنید."
fi
