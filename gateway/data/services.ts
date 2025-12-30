// داده‌های نمونه سرویس‌ها
export const servicesData = [
  {
    id: 1,
    name: 'تحلیل احساسات فارسی',
    description: 'تشخیص خودکار احساسات در متن فارسی',
    category: 'تحلیل',
    status: 'فعال',
    traffic: '۱۰۰۰ درخواست/روز',
    endpoint: '/api/sentiment',
    version: '2.1.0'
  },
  {
    id: 2,
    name: 'استخراج کلیدواژه',
    description: 'استخراج کلمات کلیدی از متن',
    category: 'استخراج',
    status: 'فعال',
    traffic: '۸۵۰ درخواست/روز',
    endpoint: '/api/keywords',
    version: '1.5.0'
  },
  {
    id: 3,
    name: 'خلاصه‌سازی متن',
    description: 'خلاصه‌سازی هوشمند متن‌های طولانی',
    category: 'پردازش',
    status: 'فعال',
    traffic: '۷۲۰ درخواست/روز',
    endpoint: '/api/summarize',
    version: '3.0.0'
  },
  {
    id: 4,
    name: 'تشخیص موجودیت',
    description: 'تشخیص اسامی خاص و موجودیت‌ها',
    category: 'تشخیص',
    status: 'فعال',
    traffic: '۹۲۰ درخواست/روز',
    endpoint: '/api/ner',
    version: '2.2.0'
  },
  {
    id: 5,
    name: 'ترجمه ماشینی',
    description: 'ترجمه خودکار متن فارسی به انگلیسی',
    category: 'ترجمه',
    status: 'غیرفعال',
    traffic: '۵۰۰ درخواست/روز',
    endpoint: '/api/translate',
    version: '1.8.0'
  },
  {
    id: 6,
    name: 'تولید متن',
    description: 'تولید متن هوشمند بر اساس ورودی',
    category: 'تولید',
    status: 'فعال',
    traffic: '۱۲۰۰ درخواست/روز',
    endpoint: '/api/generate',
    version: '2.5.0'
  },
  {
    id: 7,
    name: 'تصحیح املایی',
    description: 'تصحیح خودکار اشتباهات املایی فارسی',
    category: 'پردازش',
    status: 'فعال',
    traffic: '۱۵۰۰ درخواست/روز',
    endpoint: '/api/spellcheck',
    version: '1.9.0'
  },
  {
    id: 8,
    name: 'دسته‌بندی متن',
    description: 'دسته‌بندی موضوعی متن‌ها',
    category: 'تحلیل',
    status: 'فعال',
    traffic: '۶۸۰ درخواست/روز',
    endpoint: '/api/classify',
    version: '2.0.0'
  },
  {
    id: 9,
    name: 'تشخیص زبان',
    description: 'تشخیص خودکار زبان متن',
    category: 'تشخیص',
    status: 'فعال',
    traffic: '۱۱۰۰ درخواست/روز',
    endpoint: '/api/language',
    version: '1.2.0'
  },
  {
    id: 10,
    name: 'استخراج تاریخ',
    description: 'تشخیص و استخراج تاریخ از متن',
    category: 'استخراج',
    status: 'غیرفعال',
    traffic: '۴۰۰ درخواست/روز',
    endpoint: '/api/date',
    version: '1.0.0'
  }
];
