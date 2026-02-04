#!/bin/bash

echo "⚡ ULTI-MATE: همه کارها در یک دستور!"
echo "===================================="

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

cd ~/nlp-gateway-final

# 1. بررسی وضعیت سرور
echo -e "${BLUE}🔍 بررسی وضعیت سرور...${NC}"
if curl -s http://localhost:1680/api/health > /dev/null; then
    echo -e "${GREEN}✅ سرور فعال${NC}"
else
    echo -e "${RED}❌ سرور غیرفعال - در حال راه‌اندازی...${NC}"
    ./nlp-manager.sh start
fi

# 2. اجرای تست‌ها
echo -e "${BLUE}🧪 اجرای تست‌ها...${NC}"
./nlp-manager.sh test

# 3. بروزرسانی خودکار
echo -e "${BLUE}🤖 بروزرسانی خودکار...${NC}"
./auto-update.sh

# 4. حذف فایل‌های گزارش قدیمی
echo -e "${BLUE}🧹 پاکسازی گزارش‌های قدیمی...${NC}"
find . -name "update_report_*.txt" -mtime +1 -delete 2>/dev/null
find . -name "*.log" -mtime +3 -delete 2>/dev/null

# 5. نمایش وضعیت نهایی
echo -e "${BLUE}📊 وضعیت نهایی:${NC}"
echo ""
echo "🌐 آدرس سرور: http://localhost:1680"
echo "🔗 مخزن GitHub: https://github.com/tetrashop/nlp-gateway-system"
echo ""
git status --short
echo ""
git log --oneline -3

echo ""
echo -e "${GREEN}🎉 همه کارها انجام شد!${NC}"
