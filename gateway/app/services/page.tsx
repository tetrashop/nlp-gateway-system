'use client';

import { useState } from 'react';
import { servicesData } from '@/data/services';

export default function ServicesPage() {
  const [filteredServices, setFilteredServices] = useState(servicesData || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  // اگر servicesData وجود نداشته باشد
  if (!servicesData || !Array.isArray(servicesData)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">سرویس‌ها</h1>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
              داده‌های سرویس‌ها در دسترس نیست
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              لطفاً دوباره امتحان کنید
            </p>
          </div>
        </div>
      </div>
    );
  }

  const categories = ['همه', ...new Set(servicesData.map(s => s.category))];

  const handleSearch = () => {
    let filtered = servicesData;
    
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'همه') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('همه');
    setFilteredServices(servicesData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* هدر */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🛠️ مدیریت سرویس‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            تعداد کل سرویس‌ها: {servicesData.length}
          </p>
        </header>

        {/* فیلترها */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                جستجوی سرویس
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="نام یا توضیحات سرویس..."
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                دسته‌بندی
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end space-x-4 space-x-reverse">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔍 اعمال فیلتر
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                ♻️ بازنشانی
              </button>
            </div>
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {servicesData.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">کل سرویس‌ها</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {servicesData.filter(s => s.status === 'فعال').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">سرویس فعال</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {servicesData.filter(s => s.status === 'غیرفعال').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">سرویس غیرفعال</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(servicesData.map(s => s.category)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-400">دسته‌بندی</div>
          </div>
        </div>

        {/* جدول سرویس‌ها */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              لیست سرویس‌ها ({filteredServices.length})
            </h2>
          </div>
          
          {filteredServices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                      نام سرویس
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                      ترافیک
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredServices.map((service, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {service.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          service.status === 'فعال'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {service.traffic || 'نامشخص'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4">
                          ویرایش
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                          جزئیات
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                سرویسی یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                با تغییر فیلترها دوباره امتحان کنید
              </p>
            </div>
          )}
        </div>

        {/* فوتر */}
        <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          <p>سیستم مدیریت سرویس‌های NLP • آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>
        </footer>
      </div>
    </div>
  );
}
