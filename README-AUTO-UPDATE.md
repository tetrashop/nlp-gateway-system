# 🤖 راهنمای بروزرسانی خودکار GitHub

## ⚡ دستورات سریع

### 1. بروزرسانی کامل (توصیه شده)
```bash
cd ~/nlp-gateway-final
./auto-update.sh
cd ~/nlp-gateway-final
./one-command.shcd ~/nlp-gateway-final
./auto-update.sh "رفع باگ جستجو و بهبود کارایی"
cd ~/nlp-gateway-final
./setup-cron.sh        # تنظیم کرون
./cron-auto-update.sh  # اجرای دستی
# در crontab اضافه می‌شود
*/30 * * * * cd ~/nlp-gateway-final && ./cron-auto-update.sh
0 3 * * * cd ~/nlp-gateway-final && ./auto-update.sh --cron
0 9-18 * * 1-5 cd ~/nlp-gateway-final && ./cron-auto-update.sh
nano ~/.nlp-git-config
# فایل ~/.nlp-git-config
export GITHUB_URL="git@github.com:USERNAME/REPO.git"
export DEFAULT_BRANCH="main"
export AUTO_COMMIT_PREFIX="🔄 آپدیت"
export NOTIFY_ON_SUCCESS=true
source config.sh
show_config
# آخرین لاگ
tail -f ~/nlp-gateway-final/update.log

# لاگ کرون
tail -f ~/nlp-gateway-final/cron-update-$(date +%Y%m%d).log

# همه لاگ‌ها
ls -la ~/nlp-gateway-final/*.log
# آخرین لاگ
tail -f ~/nlp-gateway-final/update.log

# لاگ کرون
tail -f ~/nlp-gateway-final/cron-update-$(date +%Y%m%d).log

# همه لاگ‌ها
ls -la ~/nlp-gateway-final/*.log
# آخرین گزارش
cat ~/nlp-gateway-final/update_report_*.txt | tail -1

# خلاصه امروز
grep -h "✅\|❌" ~/nlp-gateway-final/cron-update-$(date +%Y%m%d).log
# بررسی وضعیت
git status

# بررسی remote
git remote -v

# pull و امتحان مجدد
git pull origin main --rebase
./one-command.sh
# بررسی تغییرات
git status --porcelain

# اضافه کردن دستی
git add .
git commit -m "رفع مشکل commit خودکار"
./one-command.sh
cp -r ~/nlp-gateway-final ~/nlp-gateway-backup
./ci-cd.sh test
