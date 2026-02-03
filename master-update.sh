#!/bin/bash

# ==============================================
# 🚀 MASTER SCRIPT - بروزرسانی کامل در یک کلیک
# ==============================================

echo "🚀 شروع بروزرسانی کامل GitHub..."

# 1. اجرای تست‌ها
echo "🧪 اجرای تست‌ها..."
if [ -f "ci-cd.sh" ]; then
    ./ci-cd.sh test
else
    echo "⚠️ فایل ci-cd.sh یافت نشد"
fi

# 2. بروزرسانی خودکار
echo "🔄 بروزرسانی خودکار..."
if [ -f "auto-update.sh" ]; then
    ./auto-update.sh "بروزرسانی کامل: $(date '+%Y-%m-%d %H:%M:%S')"
elif [ -f "one-command.sh" ]; then
    ./one-command.sh
else
    echo "❌ هیچ اسکریپت بروزرسانی یافت نشد!"
    exit 1
fi

# 3. نمایش نتیجه
echo ""
echo "✅ بروزرسانی کامل انجام شد!"
echo ""
echo "📊 گزارش نهایی:"
echo "----------------------------------------"
git log --oneline -3 2>/dev/null || echo "Git log در دسترس نیست"
echo "----------------------------------------"
echo "🌐 مخزن: https://github.com/tetrashop/nlp-gateway-system"
echo "📁 لاگ: ~/nlp-gateway-final/update.log" 2>/dev/null || echo "فایل لاگ یافت نشد"
echo ""
echo "🎉 تلاش برای بروزرسانی GitHub انجام شد!"
