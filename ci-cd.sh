#!/bin/bash

# تنظیمات رنگ
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# توابع
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $1${NC}"; }

# مسیر پروژه
PROJECT_DIR="$HOME/nlp-gateway-final"
cd "$PROJECT_DIR" || exit 1

# تابع بررسی تغییرات
check_for_changes() {
    log "بررسی تغییرات..."
    
    # بررسی وضعیت git
    git fetch origin
    
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        log "✅ هیچ تغییراتی برای pull/push وجود ندارد"
        return 1
    else
        log "🔍 تغییرات جدید یافت شد"
        return 0
    fi
}

# تابع اجرای تست‌ها
run_tests() {
    log "اجرای تست‌ها..."
    
    # تست سرور
    if curl -s http://localhost:1680/api/health > /dev/null; then
        log "✅ تست سلامت سرور موفق"
    else
        error "❌ تست سلامت سرور ناموفق"
        return 1
    fi
    
    # تست API‌های اصلی
    APIs=(
        "/api/stats"
        "/api/posts?limit=1"
    )
    
    for api in "${APIs[@]}"; do
        if curl -s "http://localhost:1680$api" > /dev/null; then
            log "✅ تست $api موفق"
        else
            warn "⚠️  تست $api ناموفق"
        fi
    done
    
    return 0
}

# تابع build پروژه
build_project() {
    log "Build پروژه..."
    
    # بررسی package.json
    if [ -f "package.json" ]; then
        log "بررسی وابستگی‌ها..."
        npm audit --audit-level=moderate 2>/dev/null
        
        # اگر نیاز به نصب داشت
        if [ ! -d "node_modules" ]; then
            log "نصب وابستگی‌ها..."
            npm install
        fi
    fi
    
    # ساخت پوشه‌های لازم
    mkdir -p data/posts data/logs backups
    
    log "✅ Build تکمیل شد"
}

# تابع deploy
deploy() {
    log "شروع فرآیند deploy..."
    
    # 1. دریافت آخرین تغییرات
    log "Pull آخرین تغییرات..."
    git pull origin main
    
    # 2. نصب وابستگی‌ها
    log "نصب وابستگی‌ها..."
    npm install
    
    # 3. restart سرور
    log "Restart سرور..."
    pkill -f "node.*simple-gateway" 2>/dev/null
    sleep 2
    
    # 4. شروع سرور
    log "شروع سرور..."
    nohup node simple-gateway.js > server.log 2>&1 &
    sleep 5
    
    # 5. بررسی سلامت
    if curl -s http://localhost:1680/api/health > /dev/null; then
        log "✅ Deploy موفقیت‌آمیز"
        return 0
    else
        error "❌ Deploy ناموفق"
        return 1
    fi
}

# تابع backup
create_backup() {
    log "ایجاد backup..."
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_DIR="$PROJECT_DIR/backups/$TIMESTAMP"
    
    mkdir -p "$BACKUP_DIR"
    
    # کپی فایل‌های مهم
    cp -r data "$BACKUP_DIR/"
    cp simple-gateway.js "$BACKUP_DIR/"
    cp package.json "$BACKUP_DIR/"
    cp server.log "$BACKUP_DIR/" 2>/dev/null
    
    # فشرده‌سازی
    cd "$PROJECT_DIR/backups" && tar -czf "${TIMESTAMP}.tar.gz" "$TIMESTAMP"
    
    log "✅ Backup ایجاد شد: backups/${TIMESTAMP}.tar.gz"
}

# تابع اصلی CI/CD
ci_cd_pipeline() {
    log "شروع pipeline CI/CD..."
    
    # مرحله 1: دریافت تغییرات
    if ! check_for_changes; then
        log "Pipeline متوقف شد (بدون تغییرات)"
        return 0
    fi
    
    # مرحله 2: backup
    create_backup
    
    # مرحله 3: تست‌ها
    if ! run_tests; then
        error "❌ تست‌ها ناموفق بودند. Pipeline متوقف شد."
        return 1
    fi
    
    # مرحله 4: build
    build_project
    
    # مرحله 5: deploy
    if deploy; then
        log "🎉 Pipeline با موفقیت تکمیل شد"
        
        # گزارش موفقیت
        echo "================================="
        echo "✅ DEPLOY SUCCESSFUL"
        echo "📅 زمان: $(date)"
        echo "🌐 آدرس: http://localhost:1680"
        echo "📊 وضعیت: $(curl -s http://localhost:1680/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
        echo "================================="
        
        return 0
    else
        error "❌ Pipeline ناموفق"
        
        # بازگردانی از backup
        warn "تلاش برای rollback..."
        
        LATEST_BACKUP=$(ls -t backups/*.tar.gz 2>/dev/null | head -1)
        if [ -n "$LATEST_BACKUP" ]; then
            log "Restore از backup: $LATEST_BACKUP"
            tar -xzf "$LATEST_BACKUP" -C /
        fi
        
        return 1
    fi
}

# اجرای بر اساس آرگومان
case "$1" in
    "deploy")
        deploy
        ;;
    "test")
        run_tests
        ;;
    "backup")
        create_backup
        ;;
    "full")
        ci_cd_pipeline
        ;;
    *)
        echo "استفاده: $0 [deploy|test|backup|full]"
        echo ""
        echo "  deploy  - فقط deploy"
        echo "  test    - فقط اجرای تست‌ها"
        echo "  backup  - فقط backup"
        echo "  full    - اجرای کامل CI/CD pipeline"
        exit 1
        ;;
esac
