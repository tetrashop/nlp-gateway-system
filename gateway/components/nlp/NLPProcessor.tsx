'use client';

import React, { useState } from 'react';
import { NLPService } from '../../types/nlp';

interface NLPProcessorProps {
  service: NLPService;
}

const NLPProcessor: React.FC<NLPProcessorProps> = ({ service }) => {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const samples = [
    {
      text: 'امروز هوای تهران واقعاً عالی است. آسمان آبی و خورشید درخشان باعث شده احساس شادی کنم.',
      label: 'متن مثبت'
    },
    {
      text: 'شرکت گوگل در سال ۱۹۹۸ توسط لری پیج و سرگی برین در کالیفرنیا تأسیس شد.',
      label: 'متن اطلاعاتی'
    },
    {
      text: 'متأسفانه کیفیت محصولات این شرکت به شدت کاهش یافته و نیاز به بازنگری اساسی دارد.',
      label: 'متن انتقادی'
    }
  ];

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('لطفا متن را وارد کنید');
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/nlp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'demo-key'
        },
        body: JSON.stringify({
          serviceId: service.id,
          text,
          action: 'analyze'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'خطا در پردازش');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setProcessing(false);
    }
  };

  const handleSample = (sampleText: string) => {
    setText(sampleText);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* هدر پردازنده */}
      <div className={`${service.color} p-6`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{service.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{service.name}</h2>
              <p className="text-white/90 mt-1">{service.description}</p>
            </div>
          </div>
          <div className="text-white/80 text-sm">
            <div>ورژن: {service.version}</div>
            <div className="mt-1">تأخیر متوسط: {service.latency}ms</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* سمت چپ: ورودی و کنترل‌ها */}
          <div className="lg:col-span-2 space-y-6">
            {/* نمونه‌های آماده */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                نمونه‌های آماده:
              </h3>
              <div className="flex flex-wrap gap-2">
                {samples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSample(sample.text)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ورودی متن */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                متن ورودی:
              </h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="متن خود را اینجا وارد کنید..."
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{text.length} کاراکتر</span>
                <span>{text.trim().split(/\s+/).length} کلمه</span>
              </div>
            </div>

            {/* دکمه ارسال */}
            <button
              onClick={handleSubmit}
              disabled={processing || !text.trim()}
              className={`w-full py-4 rounded-lg text-lg font-bold transition-all ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  در حال پردازش...
                </div>
              ) : (
                `پردازش با ${service.name}`
              )}
            </button>
          </div>

          {/* سمت راست: اطلاعات سرویس */}
          <div className="space-y-6">
            {/* اطلاعات سرویس */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                ℹ️ اطلاعات سرویس
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">دسته‌بندی:</span>
                  <span className="font-medium">{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">وضعیت:</span>
                  <span className={`font-medium ${
                    service.status === 'active' ? 'text-green-600' :
                    service.status === 'beta' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {service.status === 'active' ? 'فعال' : 'بتا'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">محدودیت:</span>
                  <span className="font-medium">{service.rateLimit} درخواست/ساعت</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">نیاز به احراز:</span>
                  <span className="font-medium">
                    {service.requiresAuth ? '✅ دارد' : '❌ ندارد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">نوع خروجی:</span>
                  <span className="font-medium">
                    {service.outputType === 'json' ? 'JSON' :
                     service.outputType === 'text' ? 'متن' :
                     service.outputType === 'html' ? 'HTML' : 'CSV'}
                  </span>
                </div>
              </div>
            </div>

            {/* تگ‌ها */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                🏷️ تگ‌های سرویس
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* نکات مهم */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3 text-blue-800 dark:text-blue-300">
                💡 نکات استفاده
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>حداکثر طول متن: ۱۰,۰۰۰ کاراکتر</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>فرمت پشتیبانی شده: UTF-8 فارسی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>زمان پاسخ‌گویی: ۵ ثانیه</span>
                </li>
                {service.requiresAuth && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>نیاز به API Key دارد</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* نتایج */}
        {(result || error) && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
              {result?.success ? '✅ نتایج پردازش' : '❌ خطا در پردازش'}
            </h3>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <div className="font-bold">خطا:</div>
                    <div>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {result?.success && (
              <div className="space-y-4">
                {/* اطلاعات پردازش */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="text-sm text-green-600 dark:text-green-400">زمان پردازش</div>
                    <div className="text-2xl font-bold">{result.processingTime.toFixed(0)}ms</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <div className="text-sm text-blue-600 dark:text-blue-400">زمان اجرا</div>
                    <div className="text-lg font-bold">
                      {new Date(result.timestamp).toLocaleTimeString('fa-IR')}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <div className="text-sm text-purple-600 dark:text-purple-400">شناسه سرویس</div>
                    <div className="text-lg font-bold">{result.serviceId}</div>
                  </div>
                </div>

                {/* نمایش نتایج */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                  <h4 className="font-bold mb-3 text-gray-800 dark:text-white">خروجی:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NLPProcessor;
