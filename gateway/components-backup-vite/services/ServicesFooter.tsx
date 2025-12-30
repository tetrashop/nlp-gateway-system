import React from 'react';
import Link from 'next/link';
import { Server, Clock, Headphones, Award } from 'lucide-react';

const ServicesFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ویژگی‌های سرویس‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Server className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="font-bold mb-2">زیرساخت قدرتمند</h4>
            <p className="text-gray-400 text-sm">
              سرورهای اختصاصی با آپتایم ۹۹.۹٪
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="font-bold mb-2">پاسخگویی سریع</h4>
            <p className="text-gray-400 text-sm">
              میانگین پاسخ API کمتر از ۱۰۰ms
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-6 w-6 text-purple-400" />
            </div>
            <h4 className="font-bold mb-2">پشتیبانی ۲۴/۷</h4>
            <p className="text-gray-400 text-sm">
              تیم پشتیبانی آنلاین در تمام ساعات
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <h4 className="font-bold mb-2">گواهی‌های امنیتی</h4>
            <p className="text-gray-400 text-sm">
              ISO 27001 و گواهی‌های داخلی
            </p>
          </div>
        </div>

        {/* لینک‌های مفید */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4">سرویس‌های برتر</h4>
            <ul className="space-y-2">
              <li><Link href="/services/1" className="text-gray-400 hover:text-white transition">Text Processing API</Link></li>
              <li><Link href="/services/2" className="text-gray-400 hover:text-white transition">Sentiment Analysis</Link></li>
              <li><Link href="/services/28" className="text-gray-400 hover:text-white transition">Enterprise Platform</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">مشاهده همه سرویس‌ها</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">مستندات</h4>
            <ul className="space-y-2">
              <li><Link href="/docs/getting-started" className="text-gray-400 hover:text-white transition">شروع سریع</Link></li>
              <li><Link href="/docs/api-reference" className="text-gray-400 hover:text-white transition">مرجع API</Link></li>
              <li><Link href="/docs/sdk" className="text-gray-400 hover:text-white transition">کتابخانه‌های SDK</Link></li>
              <li><Link href="/docs/tutorials" className="text-gray-400 hover:text-white transition">آموزش‌های ویدیویی</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">شرکت</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">درباره ما</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition">فرصت‌های شغلی</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">بلاگ تخصصی</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">تماس با ما</Link></li>
            </ul>
          </div>
        </div>

        {/* نوار پایینی */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              <p>© ۲۰۲۴ Tetrashop Services. تمامی حقوق محفوظ است.</p>
              <p className="mt-1">۲۸ سرویس فعال • آپتایم: ۹۹.۸٪ • کاربران: ۵۰,۰۰۰+</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition">حریم خصوصی</Link>
              <Link href="/terms" className="hover:text-white transition">قوانین استفاده</Link>
              <Link href="/sla" className="hover:text-white transition">توافقنامه سطح خدمات</Link>
              <Link href="/status" className="text-green-400 hover:text-green-300 transition">
                ✅ وضعیت سرویس‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ServicesFooter;
