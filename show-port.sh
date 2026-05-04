#!/bin/bash
PID=$(cat ~/nlp-gateway/server.pid 2>/dev/null)
if [ -n "$PID" ]; then
    PORT=$(netstat -tulpn 2>/dev/null | grep $PID | grep -oE '0.0.0.0:[0-9]+' | cut -d: -f2 | head -1)
    if [ -n "$PORT" ]; then
        echo "Server running on port: $PORT"
        echo "Test: curl -H 'X-API-Key: test-key-123' http://127.0.0.1:$PORT/health"
    else
        echo "Found PID $PID but port not detected. Trying manual scan..."
        # اسکن پورت‌های رایج
        for port in 8000 8001 8080 8081 3000 5000; do
            if curl -s -o /dev/null -w "%{http_code}" -H "X-API-Key: test-key-123" http://127.0.0.1:$port/health 2>/dev/null | grep -q "200"; then
                echo "✅ Server found on port: $port"
                break
            fi
        done
    fi
else
    echo "Server not running"
fi
