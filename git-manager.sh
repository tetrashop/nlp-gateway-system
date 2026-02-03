#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# تنظیمات پروژه
PROJECT_NAME="nlp-gateway-system"
PROJECT_DIR="$HOME/nlp-gateway-final"
GIT_REMOTE="git@github.com:tetrashop/nlp-gateway-system.git"
DEFAULT_BRANCH="main"

# رفتن به دایرکتوری پروژه
cd "$PROJECT_DIR" || { echo -e "${RED}❌ دایرکتوری پروژه پیدا نشد${NC}"; exit 1; }

# تابع‌های کمکی
print_header() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. وضعیت فعلی
show_status() {
    print_header "وضعیت فعلی Git"
    
    echo -e "${CYAN}📊 اطلاعات مخزن:${NC}"
    git remote -v
    echo ""
    
    echo -e "${CYAN}🌿 شاخه فعلی:${NC}"
    git branch --show-current
    echo ""
    
    echo -e "${CYAN}📈 وضعیت تغییرات:${NC}"
    git status --short
    echo ""
    
    echo -e "${CYAN}🕐 آخرین commitها:${NC}"
    git log --oneline -5 --graph --decorate
}

# 2. آماده‌سازی برای commit
prepare_commit() {
    print_header "آماده‌سازی برای Commit"
    
    # بررسی فایل‌های اضافه شده
    print_info "بررسی فایل‌های جدید..."
    find . -name "*.js" -newer .git/index 2>/dev/null | head -10
    
    # بررسی فایل‌های تغییر یافته
    print_info "فایل‌های تغییر یافته:"
    git diff --name-only
    
    # بررسی فایل‌های حذف شده
    print_info "فایل‌های حذف شده:"
    git ls-files --deleted
    
    # نمایش diff خلاصه
    print_info "تغییرات خلاصه:"
    git diff --stat
    
    # پیشنهاد پیام commit بر اساس تغییرات
    suggest_commit_message
}

suggest_commit_message() {
    print_info "\n🎯 پیشنهاد پیام commit بر اساس تغییرات:"
    
    # تحلیل تغییرات
    CHANGES=$(git diff --stat)
    ADDED=$(git diff --cached --numstat 2>/dev/null | awk '{sum+=$1} END{print sum}')
    MODIFIED=$(git diff --name-only | wc -l)
    DELETED=$(git ls-files --deleted | wc -l)
    
    echo "تغییرات: $CHANGES"
    echo ""
    
    # پیشنهاد بر اساس نوع تغییرات
    if [ "$MODIFIED" -gt 0 ]; then
        echo "🔧 پیام پیشنهادی: 'رفع باگ و بهبود کد'"
    fi
    
    if [ "$ADDED" -gt 100 ]; then
        echo "✨ پیام پیشنهادی: 'افزودن قابلیت جدید'"
    fi
    
    if [ "$DELETED" -gt 0 ]; then
        echo "🗑️  پیام پیشنهادی: 'حذف کدهای قدیمی'"
    fi
    
    echo ""
    echo "📝 ساختار استاندارد پیام commit:"
    echo "  نوع(دامنه): توضیح مختصر"
    echo ""
    echo "انواع رایج:"
    echo "  feat:     افزودن قابلیت جدید"
    echo "  fix:      رفع باگ"
    echo "  docs:     تغییرات مستندات"
    echo "  style:    تغییرات فرمت‌بندی"
    echo "  refactor: بازنویسی کد بدون تغییر رفتار"
    echo "  test:     افزودن یا تغییر تست‌ها"
    echo "  chore:    تغییرات در ساختار پروژه"
}

# 3. ایجاد commit هوشمند
smart_commit() {
    print_header "ایجاد Commit هوشمند"
    
    local MESSAGE="$1"
    
    if [ -z "$MESSAGE" ]; then
        echo -e "${YELLOW}📝 لطفا پیام commit را وارد کنید:${NC}"
        read -r MESSAGE
    fi
    
    # بررسی وجود تغییرات
    if [ -z "$(git status --porcelain)" ]; then
        print_error "هیچ تغییراتی برای commit وجود ندارد"
        return 1
    fi
    
    # اضافه کردن تمام تغییرات
    print_info "اضافه کردن تغییرات به staging area..."
    git add .
    
    # ایجاد commit
    print_info "ایجاد commit با پیام: $MESSAGE"
    git commit -m "$MESSAGE"
    
    if [ $? -eq 0 ]; then
        print_success "Commit با موفقیت ایجاد شد"
        
        # نمایش اطلاعات commit
        echo ""
        git log --oneline -1
    else
        print_error "خطا در ایجاد commit"
    fi
}

# 4. Push به GitHub با بررسی‌های امنیتی
safe_push() {
    print_header "Push امن به GitHub"
    
    local BRANCH=${1:-$(git branch --show-current)}
    
    # بررسی ارتباط با remote
    print_info "بررسی ارتباط با GitHub..."
    if ! git remote get-url origin > /dev/null 2>&1; then
        print_error "Remote origin تنظیم نشده است"
        setup_remote
    fi
    
    # بررسی تغییرات pull نشده
    print_info "بررسی تغییرات pull نشده..."
    git fetch origin
    
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    BASE=$(git merge-base @ @{u})
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        print_success "شاخه‌ها همگام هستند"
    elif [ "$LOCAL" = "$BASE" ]; then
        print_warning "تغییرات pull نشده وجود دارد. ابتدا pull کنید."
        return 1
    elif [ "$REMOTE" = "$BASE" ]; then
        print_info "تغییرات local برای push آماده است"
    else
        print_warning "شاخه‌ها diverge شده‌اند. نیاز به merge دارید."
        return 1
    fi
    
    # اجرای تست‌های سریع قبل از push
    print_info "اجرای بررسی‌های سریع..."
    run_pre_push_checks
    
    # push به GitHub
    print_info "Push به GitHub (شاخه: $BRANCH)..."
    git push origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        print_success "Push با موفقیت انجام شد"
        print_info "🔗 آدرس مخزن: https://github.com/tetrashop/nlp-gateway-system"
    else
        print_error "خطا در push. ممکن است نیاز به force push داشته باشید."
        echo -e "${YELLOW}آیا می‌خواهید force push کنید؟ (y/n):${NC}"
        read -r CONFIRM
        if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
            git push origin "$BRANCH" --force-with-lease
        fi
    fi
}

# 5. Pull از GitHub با merge ایمن
safe_pull() {
    print_header "Pull ایمن از GitHub"
    
    local BRANCH=${1:-$(git branch --show-current)}
    
    # ذخیره تغییرات local
    print_info "ذخیره تغییرات local (stash)..."
    git stash push -m "Auto-stash before pull $(date)"
    
    # pull
    print_info "Pull از GitHub..."
    git pull origin "$BRANCH" --rebase
    
    if [ $? -ne 0 ]; then
        print_error "خطا در pull. حل conflit ها..."
        git status
        return 1
    fi
    
    # بازگرداندن تغییرات stash شده
    print_info "بازگرداندن تغییرات stash شده..."
    git stash pop
    
    print_success "Pull با موفقیت انجام شد"
}

# 6. ایجاد برچسب نسخه (Git Tag)
create_version_tag() {
    print_header "ایجاد برچسب نسخه"
    
    # خواندن نسخه از package.json
    VERSION=$(node -p "require('./package.json').version || '1.0.0'")
    
    echo -e "${CYAN}نسخه فعلی: ${VERSION}${NC}"
    echo -e "${YELLOW}آیا می‌خواهید برچسب نسخه ایجاد کنید؟ (y/n):${NC}"
    read -r CONFIRM
    
    if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}برچسب (پیشنهاد: v${VERSION}):${NC}"
        read -r TAG
        
        if [ -z "$TAG" ]; then
            TAG="v$VERSION"
        fi
        
        print_info "ایجاد برچسب: $TAG"
        git tag -a "$TAG" -m "Release $TAG"
        
        echo -e "${YELLOW}آیا برچسب را به GitHub push کنید؟ (y/n):${NC}"
        read -r PUSH_TAG
        
        if [[ "$PUSH_TAG" =~ ^[Yy]$ ]]; then
            git push origin "$TAG"
            print_success "برچسب $TAG push شد"
        fi
    fi
}

# 7. بررسی سلامت مخزن
check_repo_health() {
    print_header "بررسی سلامت مخزن Git"
    
    echo -e "${CYAN}🔍 بررسی integrity:${NC}"
    git fsck --full
    
    echo -e "\n${CYAN}📊 آمار مخزن:${NC}"
    git count-objects -vH
    
    echo -e "\n${CYAN}🧹 بررسی فایل‌های بزرگ:${NC}"
    git rev-list --objects --all | \
        git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
        awk '/^blob/ {print substr($0,6)}' | \
        sort --numeric-sort --key=2 | \
        tail -10 | \
        cut -f 2,3 --complement | \
        numfmt --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest
    
    echo -e "\n${CYAN}📈 تاریخچه:${NC}"
    git log --oneline --graph --all --decorate -20
}

# 8. پشتیبان‌گیری از تغییرات
backup_changes() {
    print_header "پشتیبان‌گیری از تغییرات"
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="git_backup_${TIMESTAMP}.patch"
    
    print_info "ایجاد پچ از تغییرات فعلی..."
    git diff HEAD > "/tmp/${BACKUP_FILE}"
    
    print_info "ایجاد پچ از staged changes..."
    git diff --cached > "/tmp/${BACKUP_FILE}_staged"
    
    print_info "ایجاد پچ از همه تغییرات (شامل untracked)..."
    git add .
    git diff HEAD > "/tmp/${BACKUP_FILE}_all"
    git reset
    
    print_success "پشتیبان‌گیری کامل شد"
    echo "فایل‌های پشتیبان در /tmp:"
    ls -la /tmp/git_backup_* 2>/dev/null | head -5
}

# 9. تنظیم remote مخزن
setup_remote() {
    print_header "تنظیم Remote مخزن"
    
    if git remote get-url origin > /dev/null 2>&1; then
        print_info "Remote origin فعلی:"
        git remote -v
        echo -e "${YELLOW}آیا می‌خواهید تغییر دهید؟ (y/n):${NC}"
        read -r CONFIRM
        if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
            return
        fi
    fi
    
    echo -e "${YELLOW}آدرس remote جدید را وارد کنید:${NC}"
    echo "پیشنهاد: $GIT_REMOTE"
    read -r NEW_REMOTE
    
    if [ -z "$NEW_REMOTE" ]; then
        NEW_REMOTE="$GIT_REMOTE"
    fi
    
    git remote remove origin 2>/dev/null
    git remote add origin "$NEW_REMOTE"
    
    print_success "Remote تنظیم شد: $NEW_REMOTE"
}

# 10. بررسی‌های قبل از push
run_pre_push_checks() {
    print_info "🔍 اجرای بررسی‌های قبل از push..."
    
    # بررسی syntax JavaScript
    if [ -f "simple-gateway.js" ]; then
        print_info "بررسی syntax فایل‌های JavaScript..."
        node -c simple-gateway.js 2>/dev/null && print_success "✅ syntax JavaScript صحیح"
    fi
    
    # بررسی وجود فایل‌های حساس
    SENSITIVE_FILES=(".env" "config.json" "secret.js")
    for file in "${SENSITIVE_FILES[@]}"; do
        if [ -f "$file" ] && git ls-files "$file" > /dev/null 2>&1; then
            print_warning "⚠️  فایل حساس $file در commit وجود دارد!"
        fi
    done
    
    # بررسی حجم commit
    COMMIT_SIZE=$(git diff --cached --stat 2>/dev/null | tail -1 | awk '{print $4}')
    if [ "$COMMIT_SIZE" -gt 10000 ]; then
        print_warning "⚠️  حجم commit بزرگ است: $COMMIT_SIZE بایت"
    fi
    
    # بررسی پیام commit
    LAST_COMMIT_MSG=$(git log -1 --pretty=%B)
    if [ ${#LAST_COMMIT_MSG} -lt 10 ]; then
        print_warning "⚠️  پیام commit خیلی کوتاه است"
    fi
}

# 11. حل conflit خودکار
auto_resolve_conflicts() {
    print_header "حل conflit خودکار"
    
    print_info "جستجوی فایل‌های با conflit..."
    CONFLICT_FILES=$(git diff --name-only --diff-filter=U)
    
    if [ -z "$CONFLICT_FILES" ]; then
        print_success "هیچ conflit یافت نشد"
        return 0
    fi
    
    echo "فایل‌های با conflit:"
    echo "$CONFLICT_FILES"
    echo ""
    
    for file in $CONFLICT_FILES; do
        print_info "پردازش فایل: $file"
        
        # برای فایل‌های package.json
        if [[ "$file" == *package.json ]]; then
            print_info "حل conflit در package.json..."
            # استفاده از نسخه جدیدتر
            git checkout --ours "$file"
            git add "$file"
        # برای فایل‌های لاگ
        elif [[ "$file" == *.log ]] || [[ "$file" == *log* ]]; then
            print_info "حذف فایل لاگ از conflit..."
            rm -f "$file"
            git add "$file"
        else
            print_warning "حل دستی conflit در $file"
            git mergetool "$file"
        fi
    done
    
    print_success "حل conflit تکمیل شد"
}

# 12. منوی اصلی
main_menu() {
    while true; do
        print_header "مدیریت Git پروژه NLP Gateway"
        
        echo -e "${CYAN}شاخه فعلی:${NC} $(git branch --show-current)"
        echo -e "${CYAN}آخرین commit:${NC} $(git log -1 --oneline)"
        echo ""
        
        echo "1. نمایش وضعیت فعلی"
        echo "2. آماده‌سازی برای commit"
        echo "3. ایجاد commit هوشمند"
        echo "4. Push به GitHub"
        echo "5. Pull از GitHub"
        echo "6. ایجاد برچسب نسخه"
        echo "7. بررسی سلامت مخزن"
        echo "8. پشتیبان‌گیری"
        echo "9. تنظیم remote"
        echo "10. حل conflit خودکار"
        echo "11. خروج"
        echo ""
        
        echo -e "${YELLOW}انتخاب کنید (1-11):${NC}"
        read -r CHOICE
        
        case $CHOICE in
            1) show_status ;;
            2) prepare_commit ;;
            3) 
                echo -e "${YELLOW}پیام commit را وارد کنید:${NC}"
                read -r MSG
                smart_commit "$MSG"
                ;;
            4) safe_push ;;
            5) safe_pull ;;
            6) create_version_tag ;;
            7) check_repo_health ;;
            8) backup_changes ;;
            9) setup_remote ;;
            10) auto_resolve_conflicts ;;
            11) 
                print_success "خروج از برنامه"
                exit 0
                ;;
            *) print_error "انتخاب نامعتبر" ;;
        esac
        
        echo ""
        echo -e "${YELLOW}برای ادامه Enter بزنید...${NC}"
        read -r
    done
}

# اجرای اسکریپت
if [ "$1" = "auto" ]; then
    # حالت خودکار برای CI/CD
    prepare_commit
    smart_commit "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
    safe_push
else
    main_menu
fi
