'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="text-9xl mb-8">🔧</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">خطا در بارگذاری سرویس‌ها</h2>
        <p className="text-gray-600 mb-8">
          در ارتباط با سرور سرویس‌ها مشکلی پیش آمده است. 
          ممکن است سیستم در حال تعمیرات باشد یا با خطای موقت مواجه شده باشیم.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            تلاش مجدد
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">سرویس‌های پشتیبان فعال هستند</p>
          <p className="text-xs text-gray-400 mt-2">
            وضعیت: ۲۸ سرویس • آپتایم: ۹۹.۸٪
          </p>
        </div>
      </div>
    </div>
  );
}
