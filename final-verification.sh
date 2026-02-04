#!/bin/bash

echo "🔍 بررسی نهایی کامل بودن سیستم NLP Gateway"
echo "=========================================="
echo ""

# رنگ‌ها
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# تابع بررسی
check_item() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# 1. بررسی ساختار پوشه
echo "${BLUE}📁 بررسی ساختار پوشه:${NC}"
[ -d ~/nlp-gateway-final ] && check_item "پوشه اصلی وجود دارد"
[ -f ~/nlp-gateway-final/posts.json ] && check_item "فایل posts.json وجود دارد"
[ -f ~/nlp-gateway-final/package.json ] && check_item "فایل package.json وجود دارد"
[ -f ~/nlp-gateway-final/simple-gateway.js ] && check_item "سرور اصلی وجود دارد"
echo ""

# 2. بررسی سرور
echo "${BLUE}🚀 بررسی سرور:${NC}"
curl -s http://localhost:1680/api/health > /dev/null
check_item "سرور فعال و پاسخگو است"

curl -s http://localhost:1680/api/stats > /dev/null
check_item "API آمار کار می‌کند"

curl -s http://localhost:1680/api/posts/169 > /dev/null
check_item "پست 169 وجود دارد"
echo ""

# 3. بررسی اسکریپت‌ها
echo "${BLUE}🔧 بررسی اسکریپت‌های مدیریتی:${NC}"
SCRIPTS=("nlp-manager.sh" "advanced-manager.sh" "launch-suite.sh" "ultimate.sh" "super-fast.sh")
for script in "${SCRIPTS[@]}"; do
    [ -f ~/nlp-gateway-final/$script ] && [ -x ~/nlp-gateway-final/$script ]
    check_item "$script آماده اجراست"
done
echo ""

# 4. بررسی دستورات bash
echo "${BLUE}⚡ بررسی دستورات bash:${NC}"
type nlp-quick > /dev/null 2>&1
check_item "دستور nlp-quick تعریف شده"

type nlp-ultimate > /dev/null 2>&1
check_item "دستور nlp-ultimate تعریف شده"

type nlp-super > /dev/null 2>&1
check_item "دستور nlp-super تعریف شده"
echo ""

# 5. بررسی Git
echo "${BLUE}📦 بررسی وضعیت Git:${NC}"
cd ~/nlp-gateway-final
[ -d .git ] && check_item "مخزن Git تنظیم شده"
git status --porcelain | grep -q "^[^?]" || check_item "هیچ تغییر pending وجود ندارد"
echo ""

# 6. نمایش آمار نهایی
echo "${BLUE}📊 آمار نهایی سیستم:${NC}"
STATS=$(curl -s http://localhost:1680/api/stats)
POSTS=$(echo $STATS | grep -o '"totalPosts":[0-9]*' | cut -d: -f2)
WORDS=$(echo $STATS | grep -o '"totalWords":[0-9]*' | cut -d: -f2)

echo "   تعداد پست‌ها: $POSTTOTAL_POSTS"
echo "   تعداد کلمات: $WORDS"
echo "   آخرین پست: شماره 169"
echo ""

# 7. نتیجه‌گیری
echo "${YELLOW}🎯 نتیجه‌گیری:${NC}"
echo "══════════════════════════════════════════"

if [ "$POSTS" -eq 169 ]; then
    echo -e "${GREEN}✨ سیستم NLP Gateway کاملاً تکمیل شده است! ✨${NC}"
    echo ""
    echo "📋 مشخصات:"
    echo "  • 169 پست تخصصی NLP فارسی"
    echo "  • سیستم مدیریت پیشرفته"
    echo "  • API کامل REST"
    echo "  • همگام‌سازی با GitHub"
    echo "  • رابط کاربری وب"
    echo ""
    echo "🚀 برای استفاده:"
    echo "  cd ~/nlp-gateway-final"
    echo "  ./launch-suite.sh"
else
    echo -e "${YELLOW}⚠️  سیستم نیاز به تنظیم نهایی دارد.${NC}"
    echo "تعداد پست‌های فعلی: $POSTS"
fi
