#!/bin/bash

echo "📅 تنظیم Cron Job برای Termux"

# در Termux از cronie استفاده می‌کنیم
if ! command -v crontab &> /dev/null; then
    echo "📦 نصب cronie..."
    pkg install cronie -y
    echo "✅ cronie نصب شد"
fi

# فعال‌سازی سرویس cron
if [ ! -f "$PREFIX/var/run/crond.pid" ]; then
    echo "🚀 راه‌اندازی سرویس cron..."
    crond
    echo "✅ سرویس cron راه‌اندازی شد"
fi

# حذف cron job های قبلی
crontab -l 2>/dev/null | grep -v "nlp-gateway" | crontab -

# اضافه کردن cron job جدید
echo "⏰ تنظیم بروزرسانی خودکار هر 30 دقیقه..."
(crontab -l 2>/dev/null; echo "*/30 * * * * cd $HOME/nlp-gateway-final && ./cron-auto-update.sh >> $HOME/nlp-gateway-final/cron.log 2>&1") | crontab -

# یا برای تست هر 5 دقیقه
(crontab -l 2>/dev/null; echo "*/5 * * * * cd $HOME/nlp-gateway-final && ./cron-auto-update.sh >> $HOME/nlp-gateway-final/cron.log 2>&1") | crontab -

echo "✅ Cron Job تنظیم شد"
echo ""
echo "📅 زمان‌بندی:"
crontab -l | grep "nlp-gateway"
echo ""
echo "📋 دستورات مدیریت:"
echo "  crontab -l          # نمایش cron job ها"
echo "  crontab -e          # ویرایش cron job ها"
echo "  pkill crond         # توقف سرویس cron"
echo "  crond               # شروع سرویس cron"
