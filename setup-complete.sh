#!/bin/bash

echo "🔧 راه‌اندازی کامل سیستم بروزرسانی خودکار GitHub"

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# تابع‌های کمکی
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

# مرحله 1: بررسی Git
print_info "بررسی Git..."
if ! command -v git &> /dev/null; then
    print_error "Git نصب نیست!"
    exit 1
fi

# مرحله 2: بررسی دایرکتوری
cd ~/nlp-gateway-final || { print_error "دایرکتوری یافت نشد"; exit 1; }

# مرحله 3: تنظیم مخزن Git
print_info "تنظیم مخزن Git..."
if [ ! -d ".git" ]; then
    git init
    git branch -M main
    git remote add origin git@github.com:tetrashop/nlp-gateway-system.git
    print_success "مخزن Git راه‌اندازی شد"
else
    print_success "مخزن Git از قبل وجود دارد"
fi

# مرحله 4: تنظیم دسترسی فایل‌ها
print_info "تنظیم دسترسی فایل‌ها..."
chmod +x *.sh 2>/dev/null
print_success "دسترسی فایل‌ها تنظیم شد"

# مرحله 5: ایجاد فایل‌های ضروری
print_info "ایجاد فایل‌های ضروری..."

# اگر auto-update.sh وجود ندارد
if [ ! -f "auto-update.sh" ]; then
    print_info "ایجاد auto-update.sh..."
    cat > auto-update.sh << 'AUTOEOF'
#!/bin/bash
echo "بروزرسانی خودکار GitHub"
echo "========================"
git add .
git commit -m "آپدیت خودکار: $(date '+%Y-%m-%d %H:%M:%S')"
git pull --rebase origin main 2>/dev/null || true
git push origin main
AUTOEOF
    chmod +x auto-update.sh
fi

# مرحله 6: تست اولیه
print_info "تست اولیه..."
if [ -f "simple-gateway.js" ]; then
    # بررسی سرور
    if curl -s http://localhost:1680/api/health > /dev/null 2>&1; then
        print_success "سرور در حال اجراست"
    else
        print_info "سرور در حال اجرا نیست (امکان تست وجود ندارد)"
    fi
fi

# مرحله 7: اولین بروزرسانی
print_info "انجام اولین بروزرسانی..."
echo ""
echo "آیا می‌خواهید اولین بروزرسانی را انجام دهید؟ (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    if [ -f "master-update.sh" ]; then
        ./master-update.sh
    elif [ -f "auto-update.sh" ]; then
        ./auto-update.sh
    else
        print_error "هیچ اسکریپت بروزرسانی یافت نشد"
    fi
fi

# مرحله 8: تنظیم cron (اختیاری)
print_info ""
echo "آیا می‌خواهید بروزرسانی خودکار هر 30 دقیقه تنظیم شود؟ (y/n)"
read -r cron_response
if [[ "$cron_response" =~ ^[Yy]$ ]]; then
    if [ -f "setup-cron.sh" ]; then
        ./setup-cron.sh
    else
        print_info "ایجاد cron job..."
        (crontab -l 2>/dev/null; echo "*/30 * * * * cd $HOME/nlp-gateway-final && ./auto-update.sh >> $HOME/nlp-gateway-final/cron.log 2>&1") | crontab -
        print_success "Cron job تنظیم شد"
    fi
fi

print_success "راه‌اندازی کامل شد!"
echo ""
echo "🎯 دستورات موجود:"
echo "  ./master-update.sh    # بروزرسانی کامل"
echo "  ./auto-update.sh      # بروزرسانی خودکار"
echo "  git status           # وضعیت Git"
echo ""
echo "📖 راهنمای بیشتر: cat README-AUTO-UPDATE.md"
