const { fakerFA: faker } = require('@faker-js/faker');
const fs = require('fs');

const categories = [
  'پردازش متن', 'ترجمه ماشینی', 'تحلیل احساسات', 
  'پاسخ‌گویی به سوالات', 'تولید متن', 'خلاصه‌سازی',
  'تشخیص موجودیت', 'دسته‌بندی متن', 'تولید کد', 'تبدیل گفتار به متن'
];

const tagsPool = [
  'هوش مصنوعی', 'فارسی', 'انگلیسی', 'یادگیری عمیق', 'Transformer',
  'BERT', 'GPT', 'API', 'رایگان', 'پیشرفته', 'آموزشی', 'تجاری',
  'متن کاوی', 'داده کاوی', 'کلود', 'باز', 'تخصصی'
];

function generateProject(id) {
  const title = generateTitle(id);
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    id,
    title,
    description: generateDescription(category),
    detailedDescription: generateDetailedDescription(category, title),
    author: faker.person.fullName(),
    category,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    progress: Math.floor(Math.random() * 40) + 60, // 60-100%
    features: generateFeatures(),
    apiEndpoint: `/api/v1/project-${id}`,
    documentationUrl: `/docs/project-${id}`,
    githubUrl: `https://github.com/tetrashop/project-${id}`,
    lastUpdated: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
    tags: generateTags(),
    usageExamples: generateExamples(),
    apiKeyRequired: Math.random() > 0.3,
    starCount: Math.floor(Math.random() * 500) + 50,
    downloadCount: Math.floor(Math.random() * 10000) + 1000,
    version: `v${(Math.random() * 2 + 1).toFixed(1)}`
  };
}

function generateTitle(id) {
  const prefixes = [
    'سامانه', 'سیستم', 'پلتفرم', 'ابزار', 'موتور', 'هوش', 'مدل',
    'چارچوب', 'کتابخانه', 'ماژول', 'راه‌حل', 'اپلیکیشن'
  ];
  
  const midTerms = [
    'پردازش', 'تحلیل', 'درک', 'تولید', 'شناسایی', 'تشخیص',
    'ترجمه', 'خلاصه‌سازی', 'طبقه‌بندی', 'پیش‌بینی', 'توصیه'
  ];
  
  const suffixes = [
    'متن فارسی', 'زبان طبیعی', 'کلام فارسی', 'اسناد متنی',
    'نظرات کاربران', 'مقالات علمی', 'اخبار', 'مکالمات',
    'پرسش‌های متنی', 'داده‌های متنی'
  ];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const mid = midTerms[Math.floor(Math.random() * midTerms.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${mid} ${suffix} ${id}`;
}

function generateDescription(category) {
  const descriptions = {
    'پردازش متن': 'سیستم پیشرفته پردازش و تحلیل متن‌های فارسی با قابلیت‌های متنوع',
    'ترجمه ماشینی': 'موتور ترجمه عصبی پیشرفته برای زبان فارسی به سایر زبان‌ها',
    'تحلیل احساسات': 'تحلیلگر هوشمند احساسات و تن متن در نظرات و بازخوردها',
    'پاسخ‌گویی به سوالات': 'سیستم پاسخ‌گویی خودکار به پرسش‌های متنی کاربران',
    'تولید متن': 'تولیدکننده متن هوشمند بر اساس زمینه و پارامترهای ورودی'
  };
  
  return descriptions[category] || 'پروژه پیشرفته پردازش زبان طبیعی با کاربردهای گسترده';
}

// تابع‌های کمکی دیگر...
console.log('✅ اسکریپت تولید پروژه‌ها ایجاد شد');
