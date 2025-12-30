'use client';

import React, { useState } from 'react';

interface NLPResult {
  success: boolean;
  error?: boolean;
  message?: string;
  processing_time?: number;
  service?: {
    version: string;
  };
  text?: string;
  stats?: {
    length?: number;
    word_count?: number;
    char_count?: number;
    cleaned_text?: string;
  };
  keywords?: string[];
  sentiment?: string;
  confidence?: 'high' | 'medium' | 'low';
  summary?: string;
  ratio?: number;
  compression_rate?: number;
  original_sentences?: number;
  summary_sentences?: number;
  limit?: number;
  word_count?: number;
}

interface NLPServiceProps {
  serviceId: string;
  endpoint: string;
  name: string;
  description: string;
}

const NLPService: React.FC<NLPServiceProps> = ({ 
  serviceId, 
  endpoint, 
  name, 
  description 
}) => {
  const [text, setText] = useState('');
  const [action, setAction] = useState<'analyze' | 'keywords' | 'sentiment' | 'summarize' | 'stats'>('analyze');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NLPResult | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('لطفا متن را وارد کنید');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          action 
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: true,
        message: error instanceof Error ? error.message : 'خطا در ارتباط با سرور'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSample = (sampleText: string) => {
    setText(sampleText);
  };

  const samples = [
    { text: 'امروز هوا واقعا عالی است. احساس شادی و انرژی مثبت دارم.', label: 'متن مثبت' },
    { text: 'متأسفانه پروژه با مشکل مواجه شده و باید راه‌حل جدیدی پیدا کنیم.', label: 'متن خنثی' },
    { text: 'از عملکرد تیم بسیار ناراضی هستم. کیفیت کار پایین آمده است.', label: 'متن منفی' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* انتخاب action */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'analyze', label: 'تحلیل متن' },
          { id: 'keywords', label: 'استخراج کلیدواژه' },
          { id: 'sentiment', label: 'تحلیل احساسات' },
          { id: 'summarize', label: 'خلاصه‌سازی' },
          { id: 'stats', label: 'آمار متن' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setAction(item.id as any)}
            className={`px-4 py-2 rounded-lg ${
              action === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* نمونه‌های آماده */}
      <div className="mb-6">
        <h4 className="font-bold mb-2">نمونه‌های آماده:</h4>
        <div className="flex flex-wrap gap-2">
          {samples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSample(sample.text)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-lg text-sm"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* ورودی متن */}
      <div className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را اینجا وارد کنید..."
          className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          dir="rtl"
        />
      </div>

      {/* دکمه ارسال */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold disabled:opacity-50"
      >
        {loading ? 'در حال پردازش...' : 'شروع پردازش'}
      </button>

      {/* نتایج */}
      {result && !result.error && result.success && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-green-700 dark:text-green-400">✅ نتیجه پردازش</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              زمان پردازش: {result.processing_time}ms
            </div>
          </div>

          {/* تحلیل متن */}
          {action === 'analyze' && result.stats && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">طول متن</div>
                  <div className="text-2xl font-bold">{result.stats.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">تعداد کلمات</div>
                  <div className="text-2xl font-bold">{result.stats.word_count}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">تعداد حروف</div>
                  <div className="text-2xl font-bold">{result.stats.char_count}</div>
                </div>
              </div>
              
              {result.stats.word_count && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400">📊 تخمین زمان مطالعه</div>
                  <div className="mt-1">{Math.ceil(result.stats.word_count / 200)} دقیقه</div>
                </div>
              )}
              
              {result.stats.cleaned_text && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">متن پاک‌سازی شده:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {result.stats.cleaned_text || result.text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* کلیدواژه‌ها */}
          {action === 'keywords' && result.keywords && (
            <div>
              <h5 className="font-bold mb-3">کلیدواژه‌های استخراج شده:</h5>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {result.word_count && result.limit && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  از بین {result.word_count} کلمه، {result.limit} کلمه کلیدی استخراج شد.
                </div>
              )}
            </div>
          )}

          {/* تحلیل احساسات */}
          {action === 'sentiment' && result.sentiment && (
            <div>
              <div className={`text-2xl font-bold mb-4 ${
                result.sentiment.includes('مثبت') ? 'text-green-600' :
                result.sentiment.includes('منفی') ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {result.sentiment}
              </div>
              
              {result.confidence && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">اطمینان تحلیل: {result.confidence}</div>
              )}
              
              {result.confidence && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.sentiment.includes('مثبت') ? 'bg-green-600' :
                      result.sentiment.includes('منفی') ? 'bg-red-600' : 'bg-yellow-600'
                    }`}
                    style={{ 
                      width: result.confidence === 'high' ? '90%' :
                            result.confidence === 'medium' ? '60%' : '30%'
                    }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* خلاصه‌سازی */}
          {action === 'summarize' && result.summary && (
            <div>
              <div className="mb-4">
                <h5 className="font-bold mb-2">خلاصه متن:</h5>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {result.summary}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.ratio && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">نسبت خلاصه‌سازی</div>
                    <div className="text-2xl font-bold">{Math.round(result.ratio * 100)}%</div>
                  </div>
                )}
                
                {result.compression_rate && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">نرخ فشرده‌سازی</div>
                    <div className="text-2xl font-bold">{result.compression_rate}</div>
                  </div>
                )}
                
                {result.original_sentences && result.summary_sentences && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">تعداد جملات</div>
                    <div className="text-2xl font-bold">
                      {result.original_sentences} → {result.summary_sentences}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* آمار */}
          {action === 'stats' && result.stats && (
            <div>
              <h5 className="font-bold mb-3">آمار متن:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(result.stats).map(([key, value]) => (
                  <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{key}</div>
                    <div className="text-xl font-bold mt-1">
                      {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* خطا */}
      {result && result.error && (
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h4 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">❌ خطا در پردازش</h4>
          <p className="text-red-600 dark:text-red-300">
            {result.message || 'خطای ناشناخته در پردازش'}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <span>سرویس پردازش متن فارسی • v{result?.service?.version || '2.0.0'}</span>
      </div>
    </div>
  );
};

export default NLPService;
