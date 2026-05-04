#!/bin/bash
BACKUP_FILE="/tmp/nlp-gateway-backup-$(date +%Y%m%d).tar.gz"
tar -czf $BACKUP_FILE ~/nlp-gateway
if command -v rclone &>/dev/null; then
    rclone copy $BACKUP_FILE remote:nlp-gateway-backups/
    echo "بکاپ ارسال شد"
else
    echo "rclone نصب نیست. بکاپ محلی: $BACKUP_FILE"
fi
