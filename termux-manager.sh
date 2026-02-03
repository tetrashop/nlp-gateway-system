#!/bin/bash

# مدیریت NLP Gateway در Termux

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd ~/nlp-gateway-final

case "$1" in
    "start")
        echo "🚀 شروع NLP Gateway..."
        pkill -f "node.*simple-gateway" 2>/dev/null
        nohup node simple-gateway.js > server.log 2>&1 &
        sleep 3
        if curl -s http://localhost:1680/api/health > /dev/null; then
            echo -e "${GREEN}✅ سرور شروع شد${NC}"
            echo "🌐 آدرس: http://localhost:1680"
        else
            echo -e "${RED}❌ خطا در شروع سرور${NC}"
        fi
        ;;
    
    "stop")
        echo "🛑 توقف NLP Gateway..."
        pkill -f "node.*simple-gateway"
        echo -e "${GREEN}✅ سرور متوقف شد${NC}"
        ;;
    
    "update")
        echo "📱 بروزرسانی از GitHub..."
        git pull origin main
        echo -e "${GREEN}✅ بروزرسانی انجام شد${NC}"
        ;;
    
    "push")
        echo "📤 Push به GitHub..."
        ./git-update
        ;;
    
    "status")
        echo "📊 وضعیت NLP Gateway:"
        echo ""
        echo "🔍 سرور:"
        if curl -s http://localhost:1680/api/health > /dev/null; then
            echo -e "  ${GREEN}✅ در حال اجرا${NC}"
        else
            echo -e "  ${RED}❌ متوقف${NC}"
        fi
        
        echo ""
        echo "📁 Git:"
        git status --short
        
        echo ""
        echo "📈 آخرین commit:"
        git log --oneline -3 2>/dev/null || echo "  هیچ commit یافت نشد"
        ;;
    
    "log")
        echo "📄 نمایش لاگ‌ها:"
        echo "1. سرور (server.log)"
        echo "2. بروزرسانی (termux-update-*.log)"
        echo "3. Cron (cron.log)"
        echo ""
        echo "انتخاب کنید (1-3):"
        read choice
        case $choice in
            1) tail -20 server.log ;;
            2) ls -t termux-update-*.log 2>/dev/null | head -1 | xargs tail -20 ;;
            3) tail -20 cron.log 2>/dev/null || echo "فایل cron.log یافت نشد" ;;
            *) echo "انتخاب نامعتبر" ;;
        esac
        ;;
    
    "schedule")
        echo "⏰ تنظیم زمان‌بندی خودکار..."
        echo "1. هر 30 دقیقه (پیشنهادی)"
        echo "2. هر 1 ساعت"
        echo "3. هر 2 ساعت"
        echo "4. غیرفعال"
        echo ""
        echo "انتخاب کنید (1-4):"
        read interval
        
        case $interval in
            1)
                echo "*/30 * * * * cd $HOME/nlp-gateway-final && ./termux-auto-update.sh" > ~/nlp-gateway-auto
                echo -e "${GREEN}✅ بروزرسانی هر 30 دقیقه تنظیم شد${NC}"
                ;;
            2)
                echo "0 * * * * cd $HOME/nlp-gateway-final && ./termux-auto-update.sh" > ~/nlp-gateway-auto
                echo -e "${GREEN}✅ بروزرسانی هر ساعت تنظیم شد${NC}"
                ;;
            3)
                echo "0 */2 * * * cd $HOME/nlp-gateway-final && ./termux-auto-update.sh" > ~/nlp-gateway-auto
                echo -e "${GREEN}✅ بروزرسانی هر 2 ساعت تنظیم شد${NC}"
                ;;
            4)
                rm -f ~/nlp-gateway-auto
                echo -e "${YELLOW}⚠️ زمان‌بندی غیرفعال شد${NC}"
                ;;
            *)
                echo -e "${RED}❌ انتخاب نامعتبر${NC}"
                ;;
        esac
        ;;
    
    "backup")
        echo "💾 ایجاد backup..."
        BACKUP_FILE="backup-$(date +%Y%m%d_%H%M%S).tar.gz"
        tar -czf "$BACKUP_FILE" ./*.sh ./*.js data/ 2>/dev/null
        echo -e "${GREEN}✅ Backup ایجاد شد: $BACKUP_FILE${NC}"
        ;;
    
    "help")
        echo "📖 راهنمای Termux Manager:"
        echo ""
        echo "  ./termux-manager.sh start     - شروع سرور"
        echo "  ./termux-manager.sh stop      - توقف سرور"
        echo "  ./termux-manager.sh update    - بروزرسانی از GitHub"
        echo "  ./termux-manager.sh push      - Push به GitHub"
        echo "  ./termux-manager.sh status    - نمایش وضعیت"
        echo "  ./termux-manager.sh log       - نمایش لاگ‌ها"
        echo "  ./termux-manager.sh schedule  - تنظیم زمان‌بندی"
        echo "  ./termux-manager.sh backup    - ایجاد backup"
        echo "  ./termux-manager.sh help      - این راهنما"
        ;;
    
    *)
        echo "استفاده: ./termux-manager.sh [start|stop|update|push|status|log|schedule|backup|help]"
        ;;
esac
