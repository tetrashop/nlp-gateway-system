#!/bin/bash

# فوق‌سریع: فقط commit و push
cd ~/nlp-gateway-final

# بررسی تغییرات
if [ -n "$(git status --porcelain)" ]; then
    echo "⚡ تغییرات شناسایی شد!"
    git add .
    git commit -m "سوپر-فست: $(date '+%Y-%m-%d %H:%M:%S')"
    git pull --rebase origin main 2>/dev/null
    git push origin main
    echo "✅ ارسال شد!"
else
    echo "📭 هیچ تغییری برای ارسال وجود ندارد"
fi
