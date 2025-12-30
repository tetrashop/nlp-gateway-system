import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🌐 NLP Gateway فارسی
          </h1>
          <p className="text-xl text-gray-600">
            یک پلتفرم یکپارچه برای مدیریت سرویس‌های پردازش زبان طبیعی
          </p>
        </header>

        {/* کارت‌های دسترسی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link 
            href="/dashboard" 
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">داشبورد مدیریت</h3>
            <p className="text-gray-600">
              مشاهده وضعیت زنده سرویس‌ها، آمار عملکرد و مدیریت درخواست‌ها
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              ورود به داشبورد →
            </div>
          </Link>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">مستندات API</h3>
            <p className="text-gray-600 mb-4">
              تمام endpointهای قابل استفاده در Gateway
            </p>
            <div className="space-y-3">
              <code className="block bg-gray-100 p-3 rounded text-sm">
                POST /api/nlp → ارسال درخواست پردازش
              </code>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                GET /api/nlp → دریافت لیست سرویس‌ها
              </code>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                GET /api/nlp?category=تحلیل → فیلتر بر اساس دسته
              </code>
            </div>
          </div>
        </div>

        {/* سرویس‌های فعال */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🛠️ سرویس‌های فعال</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-bold text-lg">تحلیل احساسات فارسی</h4>
              <p className="text-gray-600">تشخیص خودکار احساسات در متن‌های فارسی</p>
              <div className="text-sm text-gray-500 mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">فعال</span>
                <span className="mx-2">•</span>
                <span>شناسه سرویس: 1</span>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-bold text-lg">سرویس سلامت</h4>
              <p className="text-gray-600">بررسی وضعیت کلی سیستم</p>
              <div className="text-sm text-gray-500 mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">فعال</span>
                <span className="mx-2">•</span>
                <span>شناسه سرویس: 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* راهنمای تست */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">🧪 تست سریع API</h3>
          <p className="text-blue-700 mb-4">برای تست مستقیم Gateway از ترمینال استفاده کنید:</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST http://localhost:3000/api/nlp \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceId": 1,
    "text": "این محصول عالی است"
  }'`}
          </pre>
          <p className="text-blue-700 mt-4">
            یا مستقیماً به <Link href="/dashboard" className="underline font-medium">داشبورد مدیریت</Link> بروید و از آنجا تست کنید.
          </p>
        </div>

        {/* فوتر */}
        <footer className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
          <p>NLP Gateway System • نسخه ۱.۰ • توسعه‌یافته با Next.js و Flask</p>
          <p className="mt-2 text-sm">
            تمامی سرویس‌ها در حال حاضر روی localhost در حال اجرا هستند
          </p>
        </footer>
      </div>
    </div>
  );
}
