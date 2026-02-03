#!/bin/bash

echo "📅 تنظیم Cron Job برای بروزرسانی خودکار GitHub"

# حذف cron job های قبلی
crontab -l | grep -v "cron-auto-update.sh" | crontab -

# اضافه کردن cron job جدید
# هر ساعت یکبار اجرا شود
(crontab -l 2>/dev/null; echo "0 * * * * cd $HOME/nlp-gateway-final && ./cron-auto-update.sh") | crontab -

# یا هر 30 دقیقه
(crontab -l 2>/dev/null; echo "*/30 * * * * cd $HOME/nlp-gateway-final && ./cron-auto-update.sh") | crontab -

# نمایش cron job های تنظیم شده
echo "✅ Cron Job تنظیم شد:"
crontab -l | grep "cron-auto-update"
echo ""
echo "📅 زمان‌بندی:"
echo "  - هر 30 دقیقه: بروزرسانی خودکار"
echo "  - هر ساعت: پشتیبان‌گیری"
echo ""
echo "برای ویرایش: crontab -e"
