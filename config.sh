#!/bin/bash

# ==============================================
# 🎛️ فایل پیکربندی برای بروزرسانی خودکار GitHub
# ==============================================

# تنظیمات عمومی
export GIT_AUTO_UPDATE_ENABLED=true
export GIT_AUTO_COMMIT=true
export GIT_AUTO_PUSH=true
export GIT_AUTO_PULL=true

# تنظیمات پروژه
export PROJECT_NAME="nlp-gateway-system"
export GITHUB_USERNAME="tetrashop"
export GITHUB_REPO="nlp-gateway-system"
export GITHUB_URL="git@github.com:tetrashop/nlp-gateway-system.git"
export DEFAULT_BRANCH="main"

# تنظیمات commit
export AUTO_COMMIT_PREFIX="🔄 آپدیت خودکار"
export COMMIT_TYPES=("feat" "fix" "docs" "style" "refactor" "test" "chore")

# تنظیمات زمان‌بندی
export CRON_SCHEDULE="*/30 * * * *"  # هر 30 دقیقه
export DAILY_BACKUP_TIME="03:00"     # ساعت 3 بامداد

# تنظیمات لاگ
export LOG_DIR="$HOME/nlp-gateway-final/logs"
export MAX_LOG_FILES=30
export LOG_LEVEL="INFO"  # DEBUG, INFO, WARN, ERROR

# تنظیمات ایمیل/نوتیفیکیشن
export NOTIFY_ON_SUCCESS=true
export NOTIFY_ON_ERROR=true
export EMAIL_FOR_NOTIFICATIONS="your-email@example.com"

# تابع بارگیری تنظیمات
load_config() {
    if [ -f "$HOME/.nlp-git-config" ]; then
        source "$HOME/.nlp-git-config"
        echo "✅ تنظیمات شخصی بارگیری شد"
    fi
    
    # ایجاد پوشه‌های لازم
    mkdir -p "$LOG_DIR"
}

# نمایش تنظیمات
show_config() {
    echo "🎛️ تنظیمات بروزرسانی خودکار GitHub:"
    echo "===================================="
    echo "📁 پروژه: $PROJECT_NAME"
    echo "🌿 شاخه: $DEFAULT_BRANCH"
    echo "🔗 GitHub: $GITHUB_URL"
    echo "⏰ زمان‌بندی: $CRON_SCHEDULE"
    echo "📝 سطح لاگ: $LOG_LEVEL"
    echo "📁 پوشه لاگ: $LOG_DIR"
    echo ""
    echo "🔄 عملیات فعال:"
    echo "  - Auto Commit: $GIT_AUTO_COMMIT"
    echo "  - Auto Push: $GIT_AUTO_PUSH"
    echo "  - Auto Pull: $GIT_AUTO_PULL"
    echo ""
    echo "برای تغییر تنظیمات: nano ~/.nlp-git-config"
}
