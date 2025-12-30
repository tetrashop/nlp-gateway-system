'use client';

import React, { useState, useEffect } from 'react';

const GatewayStats = () => {
  const [mounted, setMounted] = useState(false);
  const [serviceStats, setServiceStats] = useState<Array<{service: string, requests: number}>>([]);

  useEffect(() => {
    // این کد فقط در مرورگر (کلاینت) اجرا می‌شود
    setMounted(true);
    const generatedStats = ['Auth Service', 'NLP Processing', 'File Upload', 'API Gateway'].map((service) => ({
      service,
      requests: Math.floor(Math.random() * 5000) // تولید عدد تصادفی فقط در کلاینت
    }));
    setServiceStats(generatedStats);
  }, []);

  const stats = [
    { label: 'درخواست‌های امروز', value: '۱۲,۴۵۰', change: '+۱۲٪' },
    { label: 'پاسخ موفق', value: '۹۹٫۲٪', change: '+۰٫۵٪' },
    { label: 'میانگین تأخیر', value: '۴۵ms', change: '-۸ms' },
    { label: 'پهنای‌باند', value: '۲٫۴GB', change: '+۱۸٪' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">آمار Gateway</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold text-gray-800 dark:text-white mr-2">{stat.value}</div>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t dark:border-gray-700 pt-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">سرویس‌های پرترافیک</h3>
        <div className="space-y-3">
          {/* 
            ابتدا یک حالت خالی رندر می‌شود تا مطابقت سرور/کلاینت حفظ شود.
            پس از mount شدن در کلاینت، اعداد تصادفی جایگزین می‌شوند.
          */}
          {!mounted ? (
            // حالت اولیه برای رندر سرور - بدون اعداد تصادفی
            ['Auth Service', 'NLP Processing', 'File Upload', 'API Gateway'].map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{service}</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">...</span>
              </div>
            ))
          ) : (
            // حالت کلاینت - با اعداد تصادفی
            serviceStats.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{item.service}</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">{item.requests} درخواست</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GatewayStats;
