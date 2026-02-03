#!/bin/bash

# ==============================================
# ⚡ یک دستور برای بروزرسانی کامل GitHub
# ==============================================

cd ~/nlp-gateway-final

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}⚡ در حال بروزرسانی کامل GitHub...${NC}"

# 1. بررسی Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}مخزن Git یافت نشد. در حال راه‌اندازی...${NC}"
    git init
    git branch -M main
    git remote add origin git@github.com:tetrashop/nlp-gateway-system.git
fi

# 2. اضافه کردن همه تغییرات
echo "📦 اضافه کردن تغییرات..."
git add .

# 3. بررسی تغییرات
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️ هیچ تغییراتی وجود ندارد.${NC}"
    exit 0
fi

# 4. ایجاد commit
COMMIT_MSG="آپدیت فوری: $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 ایجاد commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 5. Pull آخرین تغییرات
echo "📥 دریافت آخرین تغییرات..."
git pull --rebase origin main 2>/dev/null || true

# 6. Push به GitHub
echo "📤 Push به GitHub..."
if git push origin main; then
    echo -e "${GREEN}✅ بروزرسانی موفقیت‌آمیز بود!${NC}"
    echo ""
    echo "🔗 آدرس: https://github.com/tetrashop/nlp-gateway-system"
    echo "📝 Commit: $(git log -1 --oneline)"
else
    # تلاش با force push
    echo -e "${YELLOW}تلاش با force push...${NC}"
    git push origin main --force-with-lease && \
        echo -e "${GREEN}✅ Force push موفقیت‌آمیز بود!${NC}" || \
        echo -e "${RED}❌ خطا در push${NC}"
fi

# 7. نمایش وضعیت
echo ""
echo -e "${GREEN}📊 وضعیت نهایی:${NC}"
git status --short
