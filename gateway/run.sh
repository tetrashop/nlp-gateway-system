#!/bin/bash
# اسکریپت راه‌اندازی سرویس تحلیل احساسات

SERVICE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SERVICE_DIR"

echo "🚀 راه‌اندازی سرویس تحلیل احساسات فارسی..."
echo "📁 دایرکتوری: $SERVICE_DIR"

# فعال کردن محیط مجازی
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✅ محیط مجازی فعال شد"
else
    echo "❌ محیط مجازی یافت نشد. ایجاد محیط مجازی..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

# بررسی نصب بودن نیازمندی‌ها
if [ ! -f "requirements.txt" ]; then
    echo "❌ فایل requirements.txt یافت نشد"
    exit 1
fi

echo "📦 بررسی نیازمندی‌ها..."
pip install -r requirements.txt

# راه‌اندازی سرویس
echo "🔧 در حال راه‌اندازی سرور روی پورت 8001..."
python main.py
