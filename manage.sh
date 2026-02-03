#!/bin/bash

# رنگ‌ها برای نمایش بهتر
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_PORT=1680
SERVER_PID=""

# پیدا کردن PID سرور
find_server_pid() {
    SERVER_PID=$(lsof -ti:$SERVER_PORT 2>/dev/null)
}

# نمایش وضعیت
status() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}✗ سرور NLP Gateway متوقف است${NC}"
    else
        echo -e "${GREEN}✓ سرور NLP Gateway در حال اجراست (PID: $SERVER_PID)${NC}"
        echo -e "   آدرس: http://localhost:$SERVER_PORT"
    fi
}

# شروع سرور
start() {
    find_server_pid
    if [ -n "$SERVER_PID" ]; then
        echo -e "${YELLOW}⚠ سرور در حال اجراست. ابتدا آن را متوقف کنید.${NC}"
        return 1
    fi
    
    echo -e "${BLUE}🚀 شروع سرور NLP Gateway...${NC}"
    cd ~/nlp-gateway-final
    nohup node simple-gateway.js > server.log 2>&1 &
    
    sleep 2
    find_server_pid
    
    if [ -n "$SERVER_PID" ]; then
        echo -e "${GREEN}✅ سرور با موفقیت شروع شد (PID: $SERVER_PID)${NC}"
        echo -e "📝 لاگ‌ها در: ~/nlp-gateway-final/server.log"
        
        # نمایش اطلاعات
        echo ""
        echo "📌 نقاط دسترسی:"
        echo "  🌐 صفحه اصلی: http://localhost:$SERVER_PORT"
        echo "  📊 آمار کلی: http://localhost:$SERVER_PORT/api/stats"
        echo "  📝 پست‌ها: http://localhost:$SERVER_PORT/api/posts"
        echo "  🔍 جستجو: http://localhost:$SERVER_PORT/api/search?q=پردازش"
    else
        echo -e "${RED}❌ خطا در شروع سرور${NC}"
        tail -20 server.log
    fi
}

# توقف سرور
stop() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${YELLOW}⚠ سرور در حال اجرا نیست${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🛑 توقف سرور (PID: $SERVER_PID)...${NC}"
    kill $SERVER_PID 2>/dev/null
    
    sleep 1
    find_server_pid
    
    if [ -z "$SERVER_PID" ]; then
        echo -e "${GREEN}✅ سرور با موفقیت متوقف شد${NC}"
    else
        echo -e "${RED}❌ خطا در توقف سرور. تلاش با سیگنال قوی‌تر...${NC}"
        kill -9 $SERVER_PID 2>/dev/null
    fi
}

# راه‌اندازی مجدد
restart() {
    stop
    sleep 2
    start
}

# تست سلامت
test() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    echo -e "${BLUE}🧪 تست سلامت سرور...${NC}"
    
    # تست API سلامت
    if curl -s http://localhost:$SERVER_PORT/api/health > /dev/null; then
        echo -e "${GREEN}✓ تست سلامت موفق${NC}"
        
        # دریافت اطلاعات سلامت
        HEALTH=$(curl -s http://localhost:$SERVER_PORT/api/health)
        POSTS_COUNT=$(echo $HEALTH | grep -o '"postsCount":[0-9]*' | cut -d: -f2)
        UPTIME=$(echo $HEALTH | grep -o '"uptime":[0-9]*' | cut -d: -f2)
        
        echo "   📝 تعداد پست‌ها: $POSTS_COUNT"
        echo "   ⏱️ آپتایم: $UPTIME ثانیه"
    else
        echo -e "${RED}✗ تست سلامت ناموفق${NC}"
    fi
}

# نمایش لاگ‌ها
logs() {
    if [ ! -f ~/nlp-gateway-final/server.log ]; then
        echo -e "${YELLOW}⚠ فایل لاگ وجود ندارد${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📄 نمایش آخرین خطوط لاگ (20 خط آخر):${NC}"
    tail -20 ~/nlp-gateway-final/server.log
}

# نمایش آمار
stats() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📊 دریافت آمار سیستم...${NC}"
    curl -s http://localhost:$SERVER_PORT/api/stats | python3 -m json.tool 2>/dev/null || \
    curl -s http://localhost:$SERVER_PORT/api/stats
}

# نمایش پست‌ها
posts() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    PAGE=${1:-1}
    echo -e "${BLUE}📝 دریافت پست‌ها (صفحه $PAGE)...${NC}"
    curl -s "http://localhost:$SERVER_PORT/api/posts?page=$PAGE&limit=5" | python3 -m json.tool 2>/dev/null || \
    curl -s "http://localhost:$SERVER_PORT/api/posts?page=$PAGE&limit=5"
}

# جستجو
search() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    QUERY=${1:-پردازش}
    echo -e "${BLUE}🔍 جستجو برای \"$QUERY\"...${NC}"
    curl -s "http://localhost:$SERVER_PORT/api/search?q=$QUERY" | python3 -m json.tool 2>/dev/null || \
    curl -s "http://localhost:$SERVER_PORT/api/search?q=$QUERY"
}

# تحلیل متن
analyze() {
    find_server_pid
    if [ -z "$SERVER_PID" ]; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    TEXT=${1:-"پردازش زبان طبیعی جذاب است"}
    echo -e "${BLUE}🔬 تحلیل متن...${NC}"
    curl -s -X POST http://localhost:$SERVER_PORT/api/analyze \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"$TEXT\"}" | python3 -m json.tool 2>/dev/null || \
    curl -s -X POST http://localhost:$SERVER_PORT/api/analyze \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"$TEXT\"}"
}

# کمک
help() {
    echo -e "${BLUE}📖 راهنمای دستورات:${NC}"
    echo ""
    echo "  ${GREEN}./manage.sh start${NC}    - شروع سرور"
    echo "  ${GREEN}./manage.sh stop${NC}     - توقف سرور"
    echo "  ${GREEN}./manage.sh restart${NC}  - راه‌اندازی مجدد"
    echo "  ${GREEN}./manage.sh status${NC}   - وضعیت سرور"
    echo "  ${GREEN}./manage.sh test${NC}     - تست سلامت"
    echo "  ${GREEN}./manage.sh logs${NC}     - نمایش لاگ‌ها"
    echo "  ${GREEN}./manage.sh stats${NC}    - نمایش آمار"
    echo "  ${GREEN}./manage.sh posts${NC}    - نمایش پست‌ها (صفحه 1)"
    echo "  ${GREEN}./manage.sh posts 2${NC}  - نمایش پست‌ها (صفحه 2)"
    echo "  ${GREEN}./manage.sh search${NC}   - جستجوی پیش‌فرض"
    echo "  ${GREEN}./manage.sh search \"عبارت\"${NC} - جستجوی عبارت"
    echo "  ${GREEN}./manage.sh analyze${NC}  - تحلیل متن پیش‌فرض"
    echo "  ${GREEN}./manage.sh analyze \"متن\"${NC} - تحلیل متن دلخواه"
    echo "  ${GREEN}./manage.sh help${NC}     - این راهنما"
    echo ""
    echo "${YELLOW}مثال:${NC}"
    echo "  ./manage.sh start"
    echo "  ./manage.sh search \"یادگیری عمیق\""
    echo "  ./manage.sh analyze \"این سیستم بسیار عالی است\""
}

# بررسی دستور
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    test)
        test
        ;;
    logs)
        logs
        ;;
    stats)
        stats
        ;;
    posts)
        posts "$2"
        ;;
    search)
        search "$2"
        ;;
    analyze)
        analyze "$2"
        ;;
    help|--help|-h)
        help
        ;;
    *)
        echo -e "${RED}❌ دستور نامعتبر${NC}"
        echo ""
        help
        exit 1
        ;;
esac
