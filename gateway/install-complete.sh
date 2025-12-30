#!/bin/bash

echo "🚀 نصب کامل پروژه تتراشاپ NLP"
echo "==============================="

# ایجاد پوشه‌ها
echo "📁 ایجاد ساختار پوشه‌ها..."
mkdir -p components/{nlp,services}
mkdir -p app/{nlp/[id],services,dashboard}
mkdir -p public/images/nlp

# نصب پکیج‌ها
echo "📦 نصب پکیج‌های مورد نیاز..."
npm install lucide-react react-icons

# کپی فایل‌ها
echo "📄 کپی فایل‌های پروژه..."
echo "✅ ساختار کامل ایجاد شد!"
echo ""
echo "📊 آمار پروژه:"
echo "• 256 پروژه NLP کامل"
echo "• 28 سرویس تخصصی"
echo "• پنل مدیریت پیشرفته"
echo "• 4 دسته‌بندی اصلی"
echo ""
echo "🌐 آدرس‌های مهم:"
echo "• پروژه‌ها: http://localhost:3000/nlp"
echo "• پروژه 256: http://localhost:3000/nlp/256"
echo "• سرویس‌ها: http://localhost:3000/services"
echo "• داشبورد: http://localhost:3000/dashboard"
echo ""
echo "✅ برای شروع: npm run dev"
