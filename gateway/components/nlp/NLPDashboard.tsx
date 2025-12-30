'use client';

import React, { useState, useMemo } from 'react';
import { nlpServices, getCategories, getServicesByCategory } from '../../data/nlpServices';
import NLPProcessor from './NLPProcessor';
import ServiceCard from './ServiceCard';
import ServiceStats from './ServiceStats';

const NLPDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const categories = ['همه', ...getCategories()];

  const filteredServices = useMemo(() => {
    let filtered = nlpServices;

    if (selectedCategory !== 'همه') {
      filtered = getServicesByCategory(selectedCategory as any);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const selectedServiceData = selectedService
    ? nlpServices.find(s => s.id === selectedService)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* هدر داشبورد */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                🚀 گیت‌وی یکپارچه NLP فارسی
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                دسترسی متمرکز به ۲۸ سرویس پردازش زبان طبیعی فارسی
              </p>
            </div>
            <ServiceStats services={nlpServices} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* سایدبار فیلترها */}
          <div className="lg:col-span-1 space-y-6">
            {/* جستجو */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در سرویس‌ها..."
                  className="w-full p-3 pr-10 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                دسته‌بندی سرویس‌ها
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-right p-3 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category}
                    <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded mr-2">
                      {category === 'همه' 
                        ? nlpServices.length 
                        : getServicesByCategory(category as any).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* اطلاعات آماری */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                📈 آمار کلی
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">کل سرویس‌ها</span>
                  <span className="font-bold">{nlpServices.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">سرویس‌های فعال</span>
                  <span className="font-bold text-green-600">
                    {nlpServices.filter(s => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">در نسخه بتا</span>
                  <span className="font-bold text-yellow-600">
                    {nlpServices.filter(s => s.status === 'beta').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">میانگین تأخیر</span>
                  <span className="font-bold">
                    {Math.round(
                      nlpServices.reduce((acc, s) => acc + s.latency, 0) / nlpServices.length
                    )}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* محتویات اصلی */}
          <div className="lg:col-span-3">
            {selectedServiceData ? (
              /* حالت نمایش پردازنده برای سرویس انتخاب شده */
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  ← بازگشت به لیست سرویس‌ها
                </button>
                <NLPProcessor service={selectedServiceData} />
              </div>
            ) : (
              /* حالت نمایش لیست سرویس‌ها */
              <div className="space-y-6">
                {/* آمار سریع */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="text-3xl font-bold">{nlpServices.length}</div>
                    <div className="text-sm opacity-90">سرویس NLP</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="text-3xl font-bold">
                      {Math.round(
                        nlpServices.reduce((acc, s) => acc + s.rateLimit, 0) / 1000
                      )}K
                    </div>
                    <div className="text-sm opacity-90">درخواست در ساعت</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="text-3xl font-bold">
                      {Math.round(
                        nlpServices.reduce((acc, s) => acc + s.latency, 0) / nlpServices.length
                      )}ms
                    </div>
                    <div className="text-sm opacity-90">میانگین تأخیر</div>
                  </div>
                </div>

                {/* لیست سرویس‌ها */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      سرویس‌های پردازش متن فارسی
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {filteredServices.length} سرویس یافت شد
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onClick={() => setSelectedService(service.id)}
                        />
                      ))}
                    </div>

                    {filteredServices.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                          سرویسی یافت نشد
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          با تغییر فیلترها یا جستجوی خود دوباره امتحان کنید
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            🚀 گیت‌وی یکپارچه NLP فارسی • نسخه ۳.۰.۰
          </p>
          <p className="text-sm">
            تمامی ۲۸ سرویس به صورت یکپارچه و تحت یک رابط کاربری واحد مدیریت می‌شوند
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NLPDashboard;
