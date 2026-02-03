#!/bin/bash

# ==============================================
# 🚀 اسکریپت خودکار کامل برای بروزرسانی GitHub
# ==============================================

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# تنظیمات
PROJECT_DIR="$HOME/nlp-gateway-final"
LOG_FILE="$PROJECT_DIR/update.log"
BRANCH="main"
AUTO_COMMIT_MSG="آپدیت خودکار: $(date '+%Y-%m-%d %H:%M:%S')"

# ایجاد لاگ
exec > >(tee -a "$LOG_FILE") 2>&1

# تابع‌های کمکی
print_header() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${CYAN}         $1${PURPLE}                ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════╝${NC}"
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# بررسی دایرکتوری
check_directory() {
    print_header "بررسی دایرکتوری پروژه"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "دایرکتوری پروژه یافت نشد: $PROJECT_DIR"
        exit 1
    fi
    
    cd "$PROJECT_DIR" || exit 1
    print_success "در دایرکتوری پروژه: $(pwd)"
}

# بررسی Git
check_git() {
    print_header "بررسی تنظیمات Git"
    
    if ! command -v git &> /dev/null; then
        print_error "Git نصب نیست!"
        exit 1
    fi
    
    if [ ! -d ".git" ]; then
        print_warning "مخزن Git وجود ندارد. در حال راه‌اندازی..."
        git init
        git branch -M main
        print_info "مخزن Git راه‌اندازی شد"
    fi
    
    # بررسی remote
    if ! git remote | grep -q origin; then
        print_warning "Remote origin تنظیم نشده است"
        REMOTE_URL="git@github.com:tetrashop/nlp-gateway-system.git"
        git remote add origin "$REMOTE_URL"
        print_info "Remote origin اضافه شد: $REMOTE_URL"
    fi
    
    print_success "Git تنظیم است"
    print_info "شاخه فعلی: $(git branch --show-current)"
}

# اجرای تست‌ها
run_tests() {
    print_header "اجرای تست‌های خودکار"
    
    # تست 1: بررسی سلامت سرور
    print_info "بررسی سلامت سرور..."
    if curl -s http://localhost:1680/api/health > /dev/null; then
        print_success "سرور در حال اجراست"
    else
        print_warning "سرور در حال اجرا نیست. راه‌اندازی..."
        pkill -f "node.*simple-gateway" 2>/dev/null
        nohup node simple-gateway.js > /dev/null 2>&1 &
        sleep 5
        
        if curl -s http://localhost:1680/api/health > /dev/null; then
            print_success "سرور راه‌اندازی شد"
        else
            print_error "ناتوان در راه‌اندازی سرور"
            return 1
        fi
    fi
    
    # تست 2: بررسی API اصلی
    print_info "بررسی API اصلی..."
    if curl -s http://localhost:1680/api/stats > /dev/null; then
        print_success "API پاسخ می‌دهد"
    else
        print_error "API پاسخ نمی‌دهد"
        return 1
    fi
    
    # تست 3: بررسی فایل‌های ضروری
    print_info "بررسی فایل‌های ضروری..."
    ESSENTIAL_FILES=("simple-gateway.js" "package.json" "README.md")
    for file in "${ESSENTIAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file وجود دارد"
        else
            print_error "$file یافت نشد"
            return 1
        fi
    done
    
    print_success "همه تست‌ها با موفقیت گذرانده شدند"
    return 0
}

# بررسی و آماده‌سازی تغییرات
prepare_changes() {
    print_header "آماده‌سازی تغییرات"
    
    # بررسی تغییرات
    print_info "بررسی تغییرات..."
    CHANGES=$(git status --porcelain)
    
    if [ -z "$CHANGES" ]; then
        print_warning "هیچ تغییراتی برای commit وجود ندارد"
        return 1
    fi
    
    # نمایش تغییرات
    echo -e "${CYAN}تغییرات شناسایی شده:${NC}"
    git status --short
    
    # اضافه کردن همه تغییرات
    print_info "اضافه کردن تغییرات به staging area..."
    git add .
    
    # بررسی حجم تغییرات
    print_info "بررسی حجم تغییرات..."
    TOTAL_CHANGES=$(git diff --cached --stat | tail -1 | awk '{print $4}')
    print_info "حجم کل تغییرات: $TOTAL_CHANGES بایت"
    
    return 0
}

# ایجاد commit هوشمند
create_commit() {
    print_header "ایجاد Commit هوشمند"
    
    local MSG="$1"
    
    # اگر پیامی داده نشده، از تاریخ و زمان استفاده کن
    if [ -z "$MSG" ]; then
        MSG="$AUTO_COMMIT_MSG"
    fi
    
    # تحلیل تغییرات برای پیام بهتر
    print_info "تحلیل تغییرات برای پیام commit..."
    
    # شمارش انواع تغییرات
    ADDED=$(git diff --cached --numstat 2>/dev/null | awk '{sum+=$1} END{print sum+0}')
    MODIFIED=$(git diff --cached --name-only | wc -l)
    DELETED=$(git diff --cached --numstat 2>/dev/null | awk '{sum+=$2} END{print sum+0}')
    
    print_info "فایل‌های اضافه شده: $ADDED"
    print_info "فایل‌های تغییر یافته: $MODIFIED"
    print_info "فایل‌های حذف شده: $DELETED"
    
    # ایجاد commit
    print_info "ایجاد commit با پیام: $MSG"
    if git commit -m "$MSG"; then
        COMMIT_HASH=$(git log -1 --pretty=format:"%H")
        print_success "Commit ایجاد شد: $COMMIT_HASH"
        print_info "پیام: $MSG"
        return 0
    else
        print_error "خطا در ایجاد commit"
        return 1
    fi
}

# همگام‌سازی با GitHub
sync_with_github() {
    print_header "همگام‌سازی با GitHub"
    
    # دریافت آخرین تغییرات
    print_info "دریافت آخرین تغییرات از GitHub..."
    if git fetch origin; then
        print_success "تغییرات دریافت شد"
    else
        print_error "خطا در دریافت تغییرات"
        return 1
    fi
    
    # بررسی وضعیت همگام‌سازی
    print_info "بررسی وضعیت همگام‌سازی..."
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    BASE=$(git merge-base @ @{u})
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        print_success "شاخه‌ها همگام هستند"
    elif [ "$LOCAL" = "$BASE" ]; then
        print_warning "تغییرات pull نشده وجود دارد"
        print_info "در حال pull..."
        if git pull --rebase origin "$BRANCH"; then
            print_success "Pull موفقیت‌آمیز بود"
        else
            print_error "خطا در pull. نیاز به حل conflit دستی"
            return 1
        fi
    elif [ "$REMOTE" = "$BASE" ]; then
        print_info "تغییرات local برای push آماده است"
    else
        print_warning "شاخه‌ها diverge شده‌اند"
        print_info "تلاش برای rebase..."
        if git rebase origin/"$BRANCH"; then
            print_success "Rebase موفقیت‌آمیز بود"
        else
            print_error "خطا در rebase. نیاز به حل conflit دستی"
            return 1
        fi
    fi
    
    # Push به GitHub
    print_info "Push به GitHub..."
    if git push origin "$BRANCH"; then
        print_success "Push موفقیت‌آمیز بود"
        print_info "🔗 آدرس مخزن: https://github.com/tetrashop/nlp-gateway-system"
        return 0
    else
        print_warning "خطا در push. تلاش با force-with-lease..."
        if git push origin "$BRANCH" --force-with-lease; then
            print_success "Force push موفقیت‌آمیز بود"
            return 0
        else
            print_error "خطا در force push"
            return 1
        fi
    fi
}

# ایجاد برچسب نسخه (اختیاری)
create_version_tag() {
    print_header "ایجاد برچسب نسخه"
    
    # خواندن نسخه
    if [ -f "package.json" ]; then
        VERSION=$(node -p "require('./package.json').version || '1.0.0'")
    else
        VERSION="1.0.0"
    fi
    
    TAG="v$VERSION-$(date +%Y%m%d)"
    
    print_info "ایجاد برچسب: $TAG"
    if git tag -a "$TAG" -m "اتوماتیک: $TAG"; then
        print_success "برچسب ایجاد شد"
        
        # Push برچسب
        print_info "Push برچسب به GitHub..."
        if git push origin "$TAG"; then
            print_success "برچسب push شد"
        else
            print_warning "خطا در push برچسب"
        fi
    else
        print_warning "خطا در ایجاد برچسب"
    fi
}

# تولید گزارش
generate_report() {
    print_header "گزارش نهایی"
    
    REPORT_FILE="update_report_$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$REPORT_FILE" << REPORT
╔════════════════════════════════════════════╗
║          گزارش بروزرسانی خودکار           ║
╚════════════════════════════════════════════╝

📅 تاریخ: $(date)
⏱️ زمان: $(date +%H:%M:%S)

📊 اطلاعات پروژه:
  📁 مسیر: $PROJECT_DIR
  🌿 شاخه: $(git branch --show-current)
  🔗 Remote: $(git remote get-url origin)

📈 تغییرات:
  Commit: $(git log -1 --pretty=format:"%H")
  پیام: $(git log -1 --pretty=format:"%B")

📂 وضعیت فایل‌ها:
$(git status --short | sed 's/^/  /')

🔄 وضعیت همگام‌سازی:
  Local: $(git rev-parse --short HEAD)
  Remote: $(git rev-parse --short origin/main 2>/dev/null || echo "N/A")

✅ عملیات انجام شده:
  - بررسی دایرکتوری پروژه
  - اجرای تست‌های خودکار
  - ایجاد commit خودکار
  - همگام‌سازی با GitHub
  - ایجاد برچسب نسخه (اختیاری)

📝 لاگ کامل: $LOG_FILE

💡 نکات:
  - بررسی مخزن: https://github.com/tetrashop/nlp-gateway-system
  - برای مشاهده commit: git log --oneline -5
  - برای برگشت: git reset --hard HEAD~1

REPORT
    
    print_success "گزارش ایجاد شد: $REPORT_FILE"
    cat "$REPORT_FILE"
}

# تابع اصلی
main() {
    print_header "🚀 شروع فرآیند بروزرسانی خودکار GitHub"
    
    # مرحله 1: بررسی دایرکتوری
    check_directory
    
    # مرحله 2: بررسی Git
    check_git
    
    # مرحله 3: اجرای تست‌ها
    if ! run_tests; then
        print_error "تست‌ها ناموفق بودند. فرآیند متوقف شد."
        exit 1
    fi
    
    # مرحله 4: آماده‌سازی تغییرات
    if ! prepare_changes; then
        print_warning "هیچ تغییراتی برای commit وجود ندارد"
        echo -e "${YELLOW}آیا می‌خواهید ادامه دهید؟ (y/n):${NC}"
        read -r CONTINUE
        if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
            print_info "فرآیند متوقف شد"
            exit 0
        fi
    fi
    
    # مرحله 5: ایجاد commit
    COMMIT_MSG="$1"
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="$AUTO_COMMIT_MSG"
    fi
    
    if ! create_commit "$COMMIT_MSG"; then
        print_error "خطا در ایجاد commit"
        exit 1
    fi
    
    # مرحله 6: همگام‌سازی با GitHub
    if ! sync_with_github; then
        print_error "خطا در همگام‌سازی با GitHub"
        exit 1
    fi
    
    # مرحله 7: ایجاد برچسب نسخه (اختیاری)
    echo -e "${YELLOW}آیا می‌خواهید برچسب نسخه ایجاد کنید؟ (y/n):${NC}"
    read -r CREATE_TAG
    if [[ "$CREATE_TAG" =~ ^[Yy]$ ]]; then
        create_version_tag
    fi
    
    # مرحله 8: تولید گزارش
    generate_report
    
    print_header "🎉 بروزرسانی خودکار با موفقیت تکمیل شد!"
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${CYAN}🔗 مخزن GitHub:${NC}"
    echo -e "  https://github.com/tetrashop/nlp-gateway-system"
    echo ""
    echo -e "${CYAN}📊 وضعیت فعلی:${NC}"
    git status --short
    echo ""
    echo -e "${CYAN}📝 آخرین commit:${NC}"
    git log -1 --oneline
    echo ""
    echo -e "${CYAN}📄 گزارش کامل:${NC}"
    echo -e "  $PROJECT_DIR/$(ls update_report_*.txt 2>/dev/null | tail -1)"
    echo -e "${GREEN}========================================${NC}"
}

# اجرای اصلی
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo -e "${CYAN}استفاده:${NC}"
    echo "  ./auto-update.sh                    # بروزرسانی خودکار با پیام پیش‌فرض"
    echo "  ./auto-update.sh \"پیام commit\"     # بروزرسانی با پیام دلخواه"
    echo "  ./auto-update.sh --cron            # حالت cron (بدون ورودی کاربر)"
    exit 0
fi

if [[ "$1" == "--cron" ]]; then
    # حالت خودکار برای cron
    AUTO_COMMIT_MSG="آپدیت خودکار کرون: $(date '+%Y-%m-%d %H:%M:%S')"
    main "$AUTO_COMMIT_MSG"
else
    # حالت تعاملی
    main "$1"
fi
