#!/bin/bash

# 🎯 مدیریت کامل NLP Gateway
# استفاده: ./nlp-manager.sh [command]

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd ~/nlp-gateway-final

case "$1" in
    "start")
        echo -e "${BLUE}🚀 شروع NLP Gateway...${NC}"
        pkill -f "node.*simple-gateway" 2>/dev/null
        nohup node simple-gateway.js > server.log 2>&1 &
        sleep 3
        if curl -s http://localhost:1680/api/health > /dev/null; then
            echo -e "${GREEN}✅ سرور شروع شد!${NC}"
            echo -e "${BLUE}🌐 آدرس: http://localhost:1680${NC}"
            echo -e "${BLUE}📊 وضعیت: $(curl -s http://localhost:1680/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)${NC}"
        else
            echo -e "${RED}❌ خطا در شروع سرور${NC}"
            tail -5 server.log
        fi
        ;;
    
    "stop")
        echo -e "${YELLOW}🛑 توقف NLP Gateway...${NC}"
        pkill -f "node.*simple-gateway"
        echo -e "${GREEN}✅ سرور متوقف شد${NC}"
        ;;
    
    "restart")
        echo -e "${BLUE}🔄 راه‌اندازی مجدد...${NC}"
        $0 stop
        sleep 2
        $0 start
        ;;
    
    "status")
        echo -e "${BLUE}📊 وضعیت NLP Gateway:${NC}"
        echo ""
        
        # وضعیت سرور
        echo -e "${BLUE}🔍 وضعیت سرور:${NC}"
        if curl -s http://localhost:1680/api/health > /dev/null; then
            HEALTH=$(curl -s http://localhost:1680/api/health)
            STATUS=$(echo $HEALTH | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            POSTS=$(echo $HEALTH | grep -o '"postsCount":[0-9]*' | cut -d: -f2)
            echo -e "  ${GREEN}✅ فعال${NC} (پست‌ها: $POSTS, وضعیت: $STATUS)"
        else
            echo -e "  ${RED}❌ غیرفعال${NC}"
        fi
        
        # وضعیت Git
        echo -e "\n${BLUE}📁 وضعیت Git:${NC}"
        git status --short
        
        # آخرین commit
        echo -e "\n${BLUE}📝 آخرین commit:${NC}"
        git log --oneline -3 2>/dev/null || echo "  هیچ commit یافت نشد"
        
        # لاگ‌ها
        echo -e "\n${BLUE}📄 لاگ‌ها:${NC}"
        ls -la *.log 2>/dev/null | head -5
        ;;
    
    "test")
        echo -e "${BLUE}🧪 اجرای تست‌ها...${NC}"
        
        # تست سلامت
        echo -n "تست سلامت: "
        if curl -s http://localhost:1680/api/health > /dev/null; then
            echo -e "${GREEN}✅ موفق${NC}"
        else
            echo -e "${RED}❌ ناموفق${NC}"
        fi
        
        # تست آمار
        echo -n "تست آمار: "
        if curl -s http://localhost:1680/api/stats > /dev/null; then
            echo -e "${GREEN}✅ موفق${NC}"
        else
            echo -e "${RED}❌ ناموفق${NC}"
        fi
        
        # تست پست‌ها
        echo -n "تست پست‌ها: "
        if curl -s "http://localhost:1680/api/posts?limit=1" > /dev/null; then
            echo -e "${GREEN}✅ موفق${NC}"
        else
            echo -e "${RED}❌ ناموفق${NC}"
        fi
        
        # تست جستجو
        echo -n "تست جستجو: "
        if curl -s "http://localhost:1680/api/search?q=پردازش" > /dev/null; then
            echo -e "${GREEN}✅ موفق${NC}"
        else
            echo -e "${RED}❌ ناموفق${NC}"
        fi
        ;;
    
    "update")
        echo -e "${BLUE}📥 بروزرسانی از GitHub...${NC}"
        git pull origin main
        echo -e "${GREEN}✅ بروزرسانی انجام شد${NC}"
        $0 restart
        ;;
    
    "push")
        echo -e "${BLUE}📤 Push به GitHub...${NC}"
        ./git-update
        ;;
    
    "auto")
        echo -e "${BLUE}🤖 شروع حالت خودکار...${NC}"
        $0 start
        sleep 5
        $0 test
        $0 push
        ;;
    
    "logs")
        echo -e "${BLUE}📄 نمایش لاگ‌ها:${NC}"
        echo "1. لاگ سرور (server.log)"
        echo "2. لاگ بروزرسانی (update.log)"
        echo "3. لاگ cron (cron.log)"
        echo "4. همه لاگ‌ها"
        echo ""
        echo -n "انتخاب کنید (1-4): "
        read choice
        
        case $choice in
            1) tail -20 server.log ;;
            2) tail -20 update.log 2>/dev/null || echo "فایل update.log یافت نشد" ;;
            3) tail -20 cron.log 2>/dev/null || echo "فایل cron.log یافت نشد" ;;
            4) 
                echo "=== server.log ==="
                tail -10 server.log
                echo -e "\n=== update.log ==="
                tail -10 update.log 2>/dev/null || echo "موجود نیست"
                echo -e "\n=== cron.log ==="
                tail -10 cron.log 2>/dev/null || echo "موجود نیست"
                ;;
            *) echo "انتخاب نامعتبر" ;;
        esac
        ;;
    
    "web")
        echo -e "${BLUE}🌐 باز کردن در مرورگر...${NC}"
        if command -v termux-open-url &> /dev/null; then
            termux-open-url "http://localhost:1680"
        else
            echo "آدرس: http://localhost:1680"
            echo "می‌توانید این آدرس را در مرورگر خود وارد کنید"
        fi
        ;;
    
    "backup")
        echo -e "${BLUE}💾 ایجاد backup...${NC}"
        BACKUP_FILE="backup-$(date +%Y%m%d_%H%M%S).tar.gz"
        tar -czf "$BACKUP_FILE" ./*.sh ./*.js data/ processors/ 2>/dev/null
        echo -e "${GREEN}✅ Backup ایجاد شد: $BACKUP_FILE${NC}"
        echo "حجم: $(du -h "$BACKUP_FILE" | cut -f1)"
        ;;
    
    "help")
        echo -e "${BLUE}📖 راهنمای NLP Manager:${NC}"
        echo ""
        echo -e "${GREEN}دستورات اصلی:${NC}"
        echo "  start     - شروع سرور"
        echo "  stop      - توقف سرور"
        echo "  restart   - راه‌اندازی مجدد"
        echo "  status    - نمایش وضعیت"
        echo "  test      - اجرای تست‌ها"
        echo ""
        echo -e "${GREEN}مدیریت Git:${NC}"
        echo "  update    - بروزرسانی از GitHub"
        echo "  push      - Push به GitHub"
        echo ""
        echo -e "${GREEN}ابزارها:${NC}"
        echo "  logs      - نمایش لاگ‌ها"
        echo "  web       - باز کردن در مرورگر"
        echo "  backup    - ایجاد backup"
        echo "  auto      - حالت خودکار کامل"
        echo "  help      - این راهنما"
        echo ""
        echo -e "${YELLOW}مثال:${NC}"
        echo "  ./nlp-manager.sh auto    # شروع کامل و بروزرسانی"
        echo "  ./nlp-manager.sh status  # بررسی وضعیت"
        echo "  ./nlp-manager.sh push    # ارسال به GitHub"
        ;;
    
    *)
        echo -e "${RED}❌ دستور نامعتبر${NC}"
        echo "استفاده: ./nlp-manager.sh [start|stop|restart|status|test|update|push|auto|logs|web|backup|help]"
        echo ""
        echo -e "${YELLOW}برای راهنمایی بیشتر:${NC} ./nlp-manager.sh help"
        ;;
esac
