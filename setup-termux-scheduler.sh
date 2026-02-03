#!/bin/bash

echo "⏰ تنظیم زمان‌بندی با Termux Job Scheduler"

# بررسی نصب بودن termux-api
if ! command -v termux-job-scheduler &> /dev/null; then
    echo "📦 نصب Termux API..."
    pkg install termux-api -y
    echo "✅ Termux API نصب شد"
fi

# ایجاد job برای هر 30 دقیقه
echo "تنظیم job برای هر 30 دقیقه..."
termux-job-scheduler \
    --script "$HOME/nlp-gateway-final/cron-auto-update.sh" \
    --period-ms 1800000 \
    --persisted true

echo "✅ Job Scheduler تنظیم شد"
echo ""
echo "🎯 Job فعلی:"
termux-job-scheduler -p
