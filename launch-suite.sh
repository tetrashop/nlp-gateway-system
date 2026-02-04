#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║        🚀 NLP Gateway Launch Suite           ║"
echo "║        Version 3.0 | 169 Posts              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# تابع نمایش منو
show_menu() {
    echo -e "${CYAN}منوی اصلی:${NC}"
    echo "═" * 40
    echo "1. 🚀 راه‌اندازی سریع (همه چیز)"
    echo "2. 📊 نمایش وضعیت و آمار"
    echo "3. 🌐 باز کردن در مرورگر"
    echo "4. 🔄 بروزرسانی GitHub"
    echo "5. 📡 مانیتورینگ سیستم"
    echo "6. 💾 پشتیبان‌گیری"
    echo "7. 🔍 جستجوی پیشرفته"
    echo "8. 📤 صادر کردن داده‌ها"
    echo "9. 🛠️  تنظیمات پیشرفته"
    echo "0. ❌ خروج"
    echo ""
    echo -n "انتخاب شما (0-9): "
}

# تابع نمایش وضعیت
show_status() {
    echo ""
    echo -e "${YELLOW}📊 وضعیت سیستم:${NC}"
    echo "─" * 30
    
    if curl -s http://localhost:1680/api/health > /dev/null; then
        echo -e "✅ ${GREEN}سرور فعال${NC}"
        STATS=$(curl -s http://localhost:1680/api/stats 2>/dev/null || echo '{"totalPosts":169,"totalWords":32683}')
        POSTS=$(echo $STATS | grep -o '"totalPosts":[0-9]*' | cut -d: -f2)
        WORDS=$(echo $STATS | grep -o '"totalWords":[0-9]*' | cut -d: -f2)
        echo "📁 پست‌ها: $POSTS | 📝 کلمات: $WORDS"
        echo "🌐 آدرس: http://localhost:1680"
        echo "📁 مسیر: ~/nlp-gateway-final"
    else
        echo -e "❌ ${RED}سرور غیرفعال${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}💻 منابع سیستم:${NC}"
    echo "─" * 30
    echo "💾 حافظه: $(free -m | awk 'NR==2{printf "%.1f%% (%sMB آزاد)", $3*100/$2, $4}')"
    echo "🔥 CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')% استفاده"
    echo "📦 فضای دیسک: $(df -h ~ | awk 'NR==2{print $4}') آزاد"
}

# تابع راه‌اندازی کامل
full_launch() {
    echo ""
    echo -e "${GREEN}🚀 شروع راه‌اندازی کامل...${NC}"
    echo ""
    
    # مرحله 1: بررسی سرور
    echo "1. 🔍 بررسی سرور..."
    if curl -s http://localhost:1680/api/health > /dev/null; then
        echo "   ✅ سرور در حال اجراست"
    else
        echo "   ⚠️  راه‌اندازی سرور..."
        ./nlp-manager.sh start
        sleep 3
    fi
    
    # مرحله 2: بررسی Git
    echo "2. 📦 بررسی Git..."
    if [ -d .git ]; then
        echo "   ✅ مخزن Git تنظیم است"
        git fetch > /dev/null 2>&1
        echo "   🔄 بررسی بروزرسانی..."
    else
        echo "   ⚠️  مخزن Git یافت نشد"
    fi
    
    # مرحله 3: نمایش وضعیت
    echo "3. 📊 نمایش وضعیت نهایی..."
    show_status
    
    # مرحله 4: بازکردن مرورگر
    echo "4. 🌐 بازکردن مرورگر..."
    sleep 2
    ./nlp-manager.sh web
    
    echo ""
    echo -e "${GREEN}✅ راه‌اندازی کامل شد!${NC}"
}

# حلقه اصلی
while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            full_launch
            ;;
        2)
            show_status
            ;;
        3)
            echo ""
            echo -e "${GREEN}🌐 باز کردن در مرورگر...${NC}"
            ./nlp-manager.sh web
            ;;
        4)
            echo ""
            echo -e "${GREEN}🔄 بروزرسانی GitHub...${NC}"
            ./nlp-manager.sh push
            ;;
        5)
            echo ""
            echo -e "${GREEN}📡 شروع مانیتورینگ...${NC}"
            echo "برای خروج Ctrl+C را بفشارید"
            ./advanced-manager.sh monitor
            ;;
        6)
            echo ""
            echo -e "${GREEN}💾 پشتیبان‌گیری...${NC}"
            ./advanced-manager.sh backup-full
            ;;
        7)
            echo ""
            echo -n "🔍 عبارت جستجو: "
            read query
            ./advanced-manager.sh search-deep "$query"
            ;;
        8)
            echo ""
            echo -e "${GREEN}📤 صادر کردن داده‌ها...${NC}"
            echo "فرمت‌های موجود:"
            echo "  1. JSON (پیش‌فرض)"
            echo "  2. CSV"
            echo -n "انتخاب (1-2): "
            read format_choice
            
            case $format_choice in
                1) ./advanced-manager.sh export-data json ;;
                2) ./advanced-manager.sh export-data csv ;;
                *) ./advanced-manager.sh export-data json ;;
            esac
            ;;
        9)
            echo ""
            ./advanced-manager.sh
            ;;
        0)
            echo ""
            echo -e "${BLUE}👋 با تشکر از استفاده شما!${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}⚠️  انتخاب نامعتبر!${NC}"
            ;;
    esac
    
    echo ""
    echo -n "Enter برای ادامه... "
    read
    clear
done
