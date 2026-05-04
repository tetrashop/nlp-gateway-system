#!/bin/bash

GATEWAY_DIR="$HOME/nlp-gateway"
PID_FILE="$GATEWAY_DIR/server.pid"
LOG_FILE="$GATEWAY_DIR/daemon.log"

cd "$GATEWAY_DIR"

start() {
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "❌ Server already running (PID: $(cat $PID_FILE))"
        return 1
    fi
    
    echo "Starting server..."
    # اجرای مستقیم با python (بدون nohup) و هدایت خروجی به فایل
    python server.py > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 2
    
    if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "✅ Server started successfully"
        echo "📂 Logs: $LOG_FILE"
        echo "🔍 Check status: ./manage.sh status"
    else
        echo "❌ Failed to start server. Check $LOG_FILE"
        rm -f "$PID_FILE"
    fi
}

stop() {
    if [ -f "$PID_FILE" ]; then
        kill $(cat "$PID_FILE") 2>/dev/null
        rm -f "$PID_FILE"
        echo "✅ Server stopped"
    else
        # اگر فایل PID نبود اما فرآیند در حال اجرا بود
        pkill -f "python server.py" && echo "✅ Server stopped (force)"
    fi
}

status() {
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "✅ Server is running (PID: $(cat $PID_FILE))"
        # تلاش برای گرفتن health
        PORT=$(netstat -tulpn 2>/dev/null | grep $(cat $PID_FILE)/python | grep -oP ':\K\d+' | head -1)
        if [ -n "$PORT" ]; then
            curl -s -H "X-API-Key: test-key-123" "http://127.0.0.1:$PORT/health" | python -m json.tool 2>/dev/null
        fi
    else
        echo "❌ Server is not running"
    fi
}

logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo "No log file found"
    fi
}

case "$1" in
    start)   start ;;
    stop)    stop ;;
    restart) stop; sleep 2; start ;;
    status)  status ;;
    logs)    logs ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
