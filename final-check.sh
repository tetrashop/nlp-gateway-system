#!/bin/bash

echo "🔍 بررسی نهایی سیستم NLP Gateway"
echo "================================"

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. بررسی دایرکتوری
echo -n "📁 بررسی دایرکتوری پروژه: "
if [ -d ~/nlp-gateway-final ]; then
    echo -e "${GREEN}✅ موجود${NC}"
else
    echo -e "${RED}❌ یافت نشد${NC}"
    exit 1
fi

cd ~/nlp-gateway-final

# 2. بررسی سرور
echo -n "🚀 بررسی سرور: "
if curl -s http://localhost:1680/api/health > /dev/null; then
    echo -e "${GREEN}✅ فعال${NC}"
else
    echo -e "${RED}❌ غیرفعال${NC}"
fi

# 3. بررسی Git
echo -n "📦 بررسی Git: "
if [ -d .git ]; then
    echo -e "${GREEN}✅ تنظیم شده${NC}"
else
    echo -e "${RED}❌ تنظیم نشده${NC}"
fi

# 4. بررسی فایل‌های اسکریپت
SCRIPTS=("nlp-manager.sh" "auto-update.sh" "git-update" "ultimate.sh" "super-fast.sh")
for script in "${SCRIPTS[@]}"; do
    echo -n "🔧 بررسی $script: "
    if [ -f "$script" ] && [ -x "$script" ]; then
        echo -e "${GREEN}✅ آماده${NC}"
    elif [ -f "$script" ]; then
        echo -e "${YELLOW}⚠️ موجود اما قابل اجرا نیست${NC}"
        chmod +x "$script"
    else
        echo -e "${RED}❌ یافت نشد${NC}"
    fi
done

# 5. بررسی aliasها
echo -n "⚡ بررسی aliasهای bashrc: "
if alias nlp-status 2>/dev/null; then
    echo -e "${GREEN}✅ تنظیم شده${NC}"
else
    echo -e "${RED}❌ تنظیم نشده${NC}"
fi

# 6. نمایش وضعیت نهایی
echo ""
echo "📊 گزارش نهایی:"
echo "==============="
echo "🌐 سرور: http://localhost:1680"
echo "🔗 GitHub: https://github.com/tetrashop/nlp-gateway-system"
echo "📁 پوشه: ~/nlp-gateway-final"
echo ""
echo "🚀 دستورات اصلی:"
echo "  nlp-quick      - وضعیت مختصر"
echo "  nlp-status     - وضعیت کامل"
echo "  nlp-super      - بروزرسانی فوق‌سریع"
echo "  nlp-ultimate   - همه کارها"
echo "  nlp-auto       - حالت خودکار"
echo ""
echo -e "${GREEN}✅ سیستم آماده استفاده است!${NC}"
