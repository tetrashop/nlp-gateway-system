#!/bin/bash
# اسکریپت راه‌اندازی کامل سیستم NLP Gateway

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "🌐 راه‌اندازی کامل سیستم NLP Gateway"
echo "📁 دایرکتوری ریشه: $ROOT_DIR"
echo "=========================================="

# ۱. راه‌اندازی سرویس تحلیل احساسات
echo "1️⃣  راه‌اندازی سرویس تحلیل احساسات..."
cd "$ROOT_DIR/backend/sentiment-service"
if [ ! -f "venv/bin/activate" ]; then
    echo "   ایجاد محیط مجازی..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# اجرای سرویس در پس‌زمینه
python main.py &
SENTIMENT_PID=$!
echo "   ✅ سرویس تحلیل احساسات راه‌اندازی شد (PID: $SENTIMENT_PID)"
echo "   🌐 آدرس: http://localhost:8001"
echo "   📚 مستندات: http://localhost:8001/docs"

# ۲. راه‌اندازی Gateway
echo ""
echo "2️⃣  راه‌اندازی API Gateway..."
cd "$ROOT_DIR"

# بررسی وجود Next.js
if [ ! -d "node_modules" ]; then
    echo "   نصب وابستگی‌های Node.js..."
    npm install
fi

# اجرای Gateway در پس‌زمینه
npm run dev &
GATEWAY_PID=$!
echo "   ✅ API Gateway راه‌اندازی شد (PID: $GATEWAY_PID)"
echo "   🌐 آدرس: http://localhost:3000"
echo "   🔌 نقطه‌اتصال API: http://localhost:3000/api/nlp"

# ۳. نمایش اطلاعات
echo ""
echo "=========================================="
echo "🎉 سیستم با موفقیت راه‌اندازی شد!"
echo ""
echo "📊 وضعیت سرویس‌ها:"
echo "   • تحلیل احساسات: http://localhost:8001/health"
echo "   • API Gateway: http://localhost:3000/api/nlp"
echo ""
echo "🔧 تست سرویس تحلیل احساسات:"
echo "   curl -X POST http://localhost:8001/analyze \\"
echo "        -H \"Content-Type: application/json\" \\"
echo "        -d '{\"text\": \"این محصول واقعا عالی است!\"}'"
echo ""
echo "🔌 تست از طریق Gateway:"
echo "   curl -X POST http://localhost:3000/api/nlp \\"
echo "        -H \"Content-Type: application/json\" \\"
echo "        -d '{\"serviceId\": 1, \"text\": \"این محصول واقعا عالی است!\", \"apiKey\": \"default-test-key\"}'"
echo ""
echo "🛑 برای توقف سیستم، از دستور زیر استفاده کنید:"
echo "   pkill -f \"python main.py\" && pkill -f \"next\""
echo "=========================================="

# انتظار برای سیگنال توقف
trap "echo 'توقف سیستم...'; kill $SENTIMENT_PID $GATEWAY_PID 2>/dev/null; exit 0" INT TERM
wait
