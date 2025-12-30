'use client';

import { useState } from 'react';
import SearchBar from '../../components/nlp/SearchBar';
import CategoryFilter from '../../components/nlp/CategoryFilter';
import NLPProjectCard from '../../components/nlp/NLPProjectCard';

// داده‌های نمونه
const sampleProjects = [
  { id: 1, title: 'تحلیل احساسات فارسی', category: 'تحلیل', description: 'تشخیص خودکار احساسات در متن فارسی' },
  { id: 2, title: 'استخراج کلیدواژه', category: 'استخراج', description: 'استخراج کلمات کلیدی از متن' },
  { id: 3, title: 'خلاصه‌سازی متن', category: 'پردازش', description: 'خلاصه‌سازی هوشمند متن‌های طولانی' },
  { id: 4, title: 'تشخیص موجودیت', category: 'تشخیص', description: 'تشخیص اسامی خاص و موجودیت‌ها' },
  { id: 5, title: 'ترجمه ماشینی', category: 'ترجمه', description: 'ترجمه خودکار متن فارسی به انگلیسی' },
  { id: 6, title: 'تولید متن', category: 'تولید', description: 'تولید متن هوشمند بر اساس ورودی' },
];

const categories = ['همه', 'تحلیل', 'استخراج', 'پردازش', 'تشخیص', 'ترجمه', 'تولید'];

export default function NLPPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  // فیلتر پروژه‌ها
  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = project.title.includes(searchQuery) || 
                         project.description.includes(searchQuery);
    const matchesCategory = selectedCategory === 'همه' || 
                           project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    console.log('جستجو برای:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* هدر */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            🚀 پروژه‌های پردازش زبان طبیعی
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            مجموعه‌ای کامل از ۲۵۶ پروژه NLP فارسی برای تحقیق، توسعه و تولید
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="جستجو در بین ۲۵۶ پروژه NLP..."
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* فیلتر دسته‌بندی */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* آمار */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">۲۵۶</div>
            <div className="text-gray-600 dark:text-gray-400">پروژه NLP</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">۲۸</div>
            <div className="text-gray-600 dark:text-gray-400">دسته‌بندی</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">۱۲</div>
            <div className="text-gray-600 dark:text-gray-400">الگوریتم پایه</div>
          </div>
        </div>

        {/* لیست پروژه‌ها */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            پروژه‌ها ({filteredProjects.length})
          </h2>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <NLPProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                پروژه‌ای یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                با تغییر فیلترها یا عبارت جستجو دوباره امتحان کنید
              </p>
            </div>
          )}
        </div>
      </main>

      {/* فوتر */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>NLP Gateway • نسخه ۳.۰.۰ • مجموعه کامل پروژه‌های پردازش زبان طبیعی فارسی</p>
        </div>
      </footer>
    </div>
  );
}
