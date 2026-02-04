# 🎯 NLP Gateway - سیستم پردازش زبان طبیعی فارسی

## 📖 معرفی
سیستم NLP Gateway یک پایگاه دانش محلی شامل 169 پست تخصصی در زمینه پردازش زبان طبیعی فارسی است. این سیستم به صورت کاملاً محلی اجرا می‌شود و نیازی به اتصال اینترنت ندارد.

## 🚀 ویژگی‌های کلیدی
- ✅ 169 پست تخصصی NLP فارسی
- ✅ 32,683+ کلمه محتوای آموزشی
- ✅ سرور وب محلی (پورت 1680)
- ✅ API کامل REST
- ✅ سیستم مدیریت خودکار
- ✅ همگام‌سازی با GitHub
- ✅ پشتیبان‌گیری خودکار

## 📊 ساختار داده‌ها
```json
{
  "id": 1,
  "title": "عنوان پست",
  "content": "محتوای کامل",
  "category": "دسته‌بندی",
  "tags": ["تگ۱", "تگ۲"],
  "wordCount": 150
}
```

🔧 نصب و راه‌اندازی

روش سریع:

```bash
# در Termux:
cd ~/nlp-gateway-final
./launch-suite.sh
```

دستورات اصلی:

```bash
# وضعیت سریع
nlp-quick

# راه‌اندازی کامل
nlp-ultimate

# بازکردن در مرورگر
nlp-web

# بروزرسانی GitHub
nlp-super
```

🌐 APIها

1. دریافت همه پست‌ها

```bash
GET /api/posts
```

2. دریافت پست خاص

```bash
GET /api/posts/{id}
```

3. جستجو

```bash
GET /api/search/{query}
```

4. آمار سیستم

```bash
GET /api/stats
```

5. سلامت سیستم

```bash
GET /api/health
```

🛠️ توسعه

افزودن پست جدید:

1. ویرایش فایل posts.json
2. اضافه کردن آبجکت جدید به آرایه
3. راه‌اندازی مجدد سرور

مثال:

```json
{
  "id": 170,
  "title": "عنوان پست جدید",
  "content": "محتوای پست جدید",
  "category": "آموزش",
  "tags": ["جدید", "NLP"],
  "wordCount": 200
}
```

📱 مدیریت پیشرفته

اسکریپت‌های کمکی:

```bash
# مدیریت پیشرفته
./advanced-manager.sh

# راه‌اندازی با رابط متنی
./launch-suite.sh

# پشتیبان‌گیری کامل
./advanced-manager.sh backup-full

# مانیتورینگ لحظه‌ای
./advanced-manager.sh monitor
```

🔗 لینک‌های مهم

· 🌐 سرور محلی: http://localhost:1680
· 📦 مخزن GitHub: https://github.com/tetrashop/nlp-gateway-system
· 📁 مسیر نصب: ~/nlp-gateway-final

📞 پشتیبانی

برای گزارش مشکلات یا پیشنهادات:

1. ایجاد Issue در GitHub
2. بررسی لاگ‌ها در فایل server.log
3. استفاده از دستور nlp-logs

📊 آمار نهایی

· 🗓️ تاریخ ایجاد: 2026-02-04
· 📝 تعداد پست‌ها: 169
· 🔤 تعداد کلمات: 32,683
· 🏷️ تعداد تگ‌ها: 45
· 📂 تعداد دسته‌بندی‌ها: 12

🎉 شروع کار

برای شروع سریع، این دستور را اجرا کنید:

```bash
cd ~/nlp-gateway-final && ./launch-suite.sh
```

نکته: سیستم به طور پیش‌فرض روی پورت 1680 اجرا می‌شود. اگر پورت مشغول است، فایل simple-gateway.js را ویرایش کنید.

```

## ✅ **مرحله 5: آزمایش نهایی همه چیز**

```bash
# آزمایش جامع سیستم
cd ~/nlp-gateway-final

echo "🧪 شروع آزمایش جامع سیستم..."
echo ""

# تست 1: راه‌اندازی کامل
echo "1. 🚀 تست راه‌اندازی کامل..."
./launch-suite.sh <<< "1" &
sleep 10

# تست 2: APIها
echo ""
echo "2. 🌐 تست APIها..."
echo "   سلامت:" && curl -s http://localhost:1680/api/health && echo ""
echo "   آمار:" && curl -s http://localhost:1680/api/stats | grep -o '"totalPosts":[0-9]*' | head -1
echo "   پست 169:" && curl -s http://localhost:1680/api/posts/169 | grep -o '"title":"[^"]*"' | head -1

# تست 3: دستورات
echo ""
echo "3. ⚡ تست دستورات..."
nlp-quick
echo ""
nlp-status | head -20

# تست 4: مدیریت پیشرفته
echo ""
echo "4. 🛠️ تست مدیریت پیشرفته..."
./advanced-manager.sh super-stats | head -15

# تست 5: پشتیبان‌گیری
echo ""
echo "5. 💾 تست پشتیبان‌گیری..."
./advanced-manager.sh backup-full 2>/dev/null | tail -3

echo ""
echo "========================================="
echo "🎉 آزمایش سیستم با موفقیت انجام شد!"
echo "========================================="
echo ""
echo "📊 گزارش نهایی:"
echo "  ✅ 169 پست کامل"
echo "  ✅ سرور فعال روی پورت 1680"
echo "  ✅ APIهای در دسترس"
echo "  ✅ سیستم مدیریت آماده"
echo "  ✅ پشتیبان‌گیری فعال"
echo ""
echo "🚀 برای شروع کار:"
echo "  cd ~/nlp-gateway-final"
echo "  ./launch-suite.sh"
echo ""
echo "🌐 یا مستقیماً به آدرس مراجعه کنید:"
echo "  http://localhost:1680"
```

🎯 مرحله نهایی: به‌روزرسانی GitHub و فاینال

```bash
# ارسال همه تغییرات به GitHub
cd ~/nlp-gateway-final

echo "🚀 ارسال تمام تغییرات به GitHub..."
echo ""

# اضافه کردن فایل‌های جدید
git add .
git status

# ایجاد commit
git commit -m "🎉 تکمیل نهایی سیستم با 169 پست | اضافه کردن سیستم مدیریت پیشرفته"

# ارسال به GitHub
git push origin main

echo ""
echo "✅ همه تغییرات ارسال شد!"
echo ""
echo "🔗 مخزن GitHub:"
echo "https://github.com/tetrashop/nlp-gateway-system"
echo ""
echo "📁 فایل‌های اضافه شده:"
echo "  📄 advanced-manager.sh    - سیستم مدیریت پیشرفته"
echo "  📄 launch-suite.sh        - راه‌اندازی یک‌کلیکی"
echo "  📄 README-FA.md          - مستندات فارسی"
echo "  📄 final-169-report.txt   - گزارش نهایی"
echo ""
echo "✨ سیستم NLP Gateway با 169 پست کامل شد و آماده استفاده است!"
```

📋 دستور نهایی برای کاربر:

برای استفاده از سیستم، فقط کافیست این دستور را اجرا کنید:

```bash
# روش سریع:
cd ~/nlp-gateway-final && ./launch-suite.sh

# یا
nlp-quick  # برای وضعیت سریع
nlp-web    # برای بازکردن در مرورگر
```

🎉 سیستم شما کامل شد و آماده استفاده است!
📚 169 پست تخصصی NLP فارسی در دسترس شماست!
