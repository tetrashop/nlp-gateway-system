'use client';

import React, { useState, useEffect } from 'react';

const AIServices = () => {
  const [mounted, setMounted] = useState(false);
  const [usageData, setUsageData] = useState<Array<{id: number, name: string, usage: string, limit: string}>>([]);

  useEffect(() => {
    setMounted(true);
    // داده‌های شبیه‌سازی شده فقط در کلاینت
    const data = [
      { id: 1, name: 'ChatGPT API', usage: `${Math.floor(300 + Math.random() * 120)} درخواست`, limit: '۵۰۰/روز' },
      { id: 2, name: 'DALL-E Image Gen', usage: `${Math.floor(100 + Math.random() * 50)} تصویر`, limit: '۲۰۰/روز' },
      { id: 3, name: 'Whisper Transcription', usage: `${Math.floor(300 + Math.random() * 260)} دقیقه`, limit: '۱۰۰۰/روز' },
      { id: 4, name: 'Embeddings', usage: `${(0.8 + Math.random() * 0.4).toFixed(1)}M توکن`, limit: '۲M/روز' },
      { id: 5, name: 'Moderation', usage: `${Math.floor(600 + Math.random() * 290)} بررسی`, limit: '۱۰۰۰/روز' },
    ];
    setUsageData(data);
  }, []);

  const services = mounted ? usageData : [
    { id: 1, name: 'ChatGPT API', usage: '...', limit: '۵۰۰/روز' },
    { id: 2, name: 'DALL-E Image Gen', usage: '...', limit: '۲۰۰/روز' },
    { id: 3, name: 'Whisper Transcription', usage: '...', limit: '۱۰۰۰/روز' },
    { id: 4, name: 'Embeddings', usage: '...', limit: '۲M/روز' },
    { id: 5, name: 'Moderation', usage: '...', limit: '۱۰۰۰/روز' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">سرویس‌های هوش مصنوعی</h2>
      
      <div className="space-y-4">
        {services.map((service) => {
          const usageNum = parseFloat(service.usage.match(/\d+\.?\d*/)?.[0] || '0');
          const limitNum = parseFloat(service.limit.match(/\d+/)?.[0] || '1');
          const percentage = mounted ? Math.min((usageNum / limitNum) * 100, 100) : 50; // مقدار پیش‌فرض برای سرور
          
          return (
            <div key={service.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800 dark:text-gray-200">{service.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{service.usage}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">میزان استفاده</span>
                <span className="text-gray-800 dark:text-gray-300">{service.limit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIServices;
