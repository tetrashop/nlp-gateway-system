import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const NLPFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* درباره ما */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tetrashop NLP</h3>
            <p className="text-gray-400 mb-6">
              بزرگترین پلتفرم پروژه‌های پردازش زبان طبیعی در ایران، با ۲۵۶ پروژه فعال
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2">
              <li><Link href="/nlp" className="text-gray-400 hover:text-white transition">لیست پروژه‌ها</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white transition">مستندات</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-white transition">راهنمای API</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition">تعرفه‌ها</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">بلاگ</Link></li>
            </ul>
          </div>

          {/* دسته‌بندی‌ها */}
          <div>
            <h4 className="font-semibold mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2">
              <li><Link href="/nlp/category/پردازش-متن" className="text-gray-400 hover:text-white transition">پردازش متن</Link></li>
              <li><Link href="/nlp/category/ترجمه-ماشینی" className="text-gray-400 hover:text-white transition">ترجمه ماشینی</Link></li>
              <li><Link href="/nlp/category/تحلیل-احساسات" className="text-gray-400 hover:text-white transition">تحلیل احساسات</Link></li>
              <li><Link href="/nlp/category/پاسخ‌گویی-به-سوالات" className="text-gray-400 hover:text-white transition">پاسخ‌گویی به سوالات</Link></li>
              <li><Link href="/nlp/category/تولید-متن" className="text-gray-400 hover:text-white transition">تولید متن</Link></li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@tetrashop-nlp.ir</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4">📞</div>
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li>
                <p className="text-sm">تهران، خیابان ولیعصر</p>
              </li>
            </ul>
          </div>
        </div>

        {/* نوار پایینی */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© ۲۰۲۴ Tetrashop NLP. تمامی حقوق محفوظ است.</p>
          <p className="mt-2">آخرین بروزرسانی: پروژه شماره ۲۵۶ فعال شد</p>
        </div>
      </div>
    </footer>
  );
};

export default NLPFooter;
