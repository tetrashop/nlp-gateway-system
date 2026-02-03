#!/bin/bash

# ==============================================
# 🕐 اسکریپت زمان‌بندی خودکار برای GitHub
# ==============================================

cd ~/nlp-gateway-final

# لاگ‌گیری
LOG_FILE="cron-update-$(date +%Y%m%d).log"
exec >> "$LOG_FILE" 2>&1

echo "========================================="
echo "🕐 شروع بروزرسانی خودکار: $(date)"
echo "========================================="

# بررسی lock file
LOCK_FILE="/tmp/nlp-git-update.lock"
if [ -f "$LOCK_FILE" ]; then
    echo "⚠️  فرآیند قبلی در حال اجراست. خروج..."
    exit 0
fi

# ایجاد lock
touch "$LOCK_FILE"

# تابع cleanup
cleanup() {
    rm -f "$LOCK_FILE"
    echo "🔓 Lock حذف شد"
}

trap cleanup EXIT

# 1. بررسی تغییرات
echo "🔍 بررسی تغییرات..."
CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    echo "✅ هیچ تغییراتی وجود ندارد"
    exit 0
fi

echo "📋 تغییرات شناسایی شده:"
git status --short

# 2. اضافه کردن و commit کردن
echo "💾 ایجاد commit خودکار..."
git add .
COMMIT_MSG="🔄 آپدیت خودکار کرون: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# 3. همگام‌سازی با GitHub
echo "🔄 همگام‌سازی با GitHub..."
git pull --rebase origin main 2>/dev/null || true

if git push origin main; then
    echo "✅ Push موفقیت‌آمیز بود"
    
    # ایجاد گزارش
    echo ""
    echo "📊 گزارش بروزرسانی:"
    echo "  زمان: $(date)"
    echo "  Commit: $(git log -1 --oneline)"
    echo "  شاخه: $(git branch --show-current)"
    
    # ارسال نوتیفیکیشن (اختیاری)
    if command -v termux-notification &> /dev/null; then
        termux-notification -t "GitHub بروزرسانی شد" \
            -c "NLP Gateway: $(git log -1 --oneline)"
    fi
else
    echo "⚠️  خطا در push. تلاش مجدد بعدی"
fi

echo "========================================="
echo "✅ پایان بروزرسانی: $(date)"
echo "========================================="
