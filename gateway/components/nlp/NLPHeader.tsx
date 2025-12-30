'use client';

import React from 'react';

const NLPHeader: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          🚀 گیت‌وی NLP فارسی
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          مدیریت ۲۸ سرویس پردازش زبان طبیعی
        </p>
      </div>
    </header>
  );
};

export default NLPHeader;
