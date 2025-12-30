#!/bin/bash

echo "🚀 نصب کامل پروژه 256 پروژه + 28 سرویس NLP"

# نصب وابستگی‌ها
echo "📦 نصب پکیج‌های مورد نیاز..."
npm install lucide-react react-icons

# ایجاد پوشه‌ها
echo "📁 ایجاد ساختار پوشه‌ها..."
mkdir -p components/nlp
mkdir -p components/services
mkdir -p public/images/nlp

echo "✅ نصب کامل شد!"
echo ""
echo "📊 آمار پروژه:"
echo "• 256 پروژه NLP (شماره 256 ویژه)"
echo "• 28 سرویس تخصصی"
echo "• 4 دسته‌بندی اصلی"
echo "• سیستم فیلتر و جستجوی پیشرفته"
echo ""
echo "🌐 آدرس‌ها:"
echo "• پروژه‌ها: http://localhost:3000/nlp"
echo "• پروژه 256: http://localhost:3000/nlp/256"
echo "• سرویس‌ها: http://localhost:3000/services"
echo ""
echo "npm run dev را اجرا کنید"
