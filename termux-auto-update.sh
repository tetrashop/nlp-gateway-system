#!/bin/bash

# اسکریپت بهینه شده برای Termux
# هر 30 دقیقه اجرا می‌شود

cd ~/nlp-gateway-final

# لاگ‌گیری
LOG_FILE="termux-update-$(date +%Y%m%d).log"
echo "=========================================" >> "$LOG_FILE"
echo "🔄 شروع بروزرسانی: $(date)" >> "$LOG_FILE"
echo "=========================================" >> "$LOG_FILE"

# 1. بررسی تغییرات
echo "🔍 بررسی تغییرات..." | tee -a "$LOG_FILE"
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ هیچ تغییراتی وجود ندارد" | tee -a "$LOG_FILE"
    exit 0
fi

# 2. نمایش تغییرات
echo "📋 تغییرات:" | tee -a "$LOG_FILE"
git status --short | tee -a "$LOG_FILE"

# 3. اضافه کردن و commit
echo "💾 ایجاد commit..." | tee -a "$LOG_FILE"
git add . 2>/dev/null
git commit -m "📱 آپدیت Termux: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null

# 4. همگام‌سازی با GitHub
echo "🔄 همگام‌سازی با GitHub..." | tee -a "$LOG_FILE"
git pull --rebase origin main 2>/dev/null
if git push origin main 2>/dev/null; then
    echo "✅ بروزرسانی موفق بود!" | tee -a "$LOG_FILE"
    
    # ارسال نوتیفیکیشن
    if command -v termux-notification &> /dev/null; then
        termux-notification \
            -t "✅ GitHub بروزرسانی شد" \
            -c "NLP Gateway: $(git log -1 --oneline 2>/dev/null || echo 'آپدیت جدید')"
    fi
else
    echo "⚠️ خطا در بروزرسانی" | tee -a "$LOG_FILE"
fi

echo "=========================================" >> "$LOG_FILE"
echo "✅ پایان بروزرسانی: $(date)" >> "$LOG_FILE"
echo "=========================================" >> "$LOG_FILE"

# نمایش لاگ
tail -5 "$LOG_FILE"
