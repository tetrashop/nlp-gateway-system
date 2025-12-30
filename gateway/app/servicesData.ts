/**
 * داده‌های 28 سرویس کامل NLP
 */

export interface NLPService {
  id: number;
  name: string;
  description: string;
  category: 'api' | 'tool' | 'library' | 'platform';
  pricing: 'free' | 'freemium' | 'paid' | 'enterprise';
  endpoint: string;
  rateLimit: string;
  uptime: number;
  features: string[];
  languages: string[];
  documentation: string;
  status: 'active' | 'beta' | 'maintenance';
  lastUpdated: string;
  usage: {
    requests: number;
    users: number;
    satisfaction: number;
  };
}

// تابع تولید سرویس‌های دینامیک
const generateServices = (): NLPService[] => {
  const serviceNames = [
    'Text Processing API', 'Sentiment Analysis API', 'Translation API', 'Text Summarization API',
    'Named Entity Recognition API', 'Text Classification API', 'Keyword Extraction API',
    'Text Similarity API', 'Language Detection API', 'Spell Check API', 'Text Generation API',
    'Question Answering API', 'Chatbot API', 'Text Analytics Platform', 'Document Processing API',
    'Audio Transcription API', 'Image Text Recognition API', 'Text Mining Tool', 'Text Normalization API',
    'Text Embedding API', 'Text Clustering API', 'Topic Modeling API', 'Text Annotation Tool',
    'Text Validation API', 'Text Compression API', 'Text Encryption API', 'Text Watermarking API',
    'Enterprise NLP Platform'
  ];

  const descriptions = [
    'پردازش متن فارسی با دقت بالا', 'تحلیل احساسات متن‌های فارسی', 'ترجمه ماشینی فارسی به انگلیسی',
    'خلاصه‌سازی هوشمند متون', 'تشخیص موجودیت‌های نامدار در متن', 'دسته‌بندی موضوعی متون',
    'استخراج کلمات کلیدی از متن', 'محاسبه شباهت بین متون', 'تشخیص زبان متن', 'بررسی املای فارسی',
    'تولید متن هوشمند', 'پاسخ‌گویی به سوالات متنی', 'چارچوب ساخت چت‌بات', 'پلتفرم تحلیل متن',
    'پردازش اسناد و فایل‌های متنی', 'تبدیل گفتار به متن فارسی', 'تشخیص متن از تصویر',
    'ابزار استخراج داده از متن', 'نرمال‌سازی و یکسان‌سازی متن', 'تبدیل متن به بردار عددی',
    'خوشه‌بندی متون مشابه', 'مدل‌سازی موضوعی متون', 'ابزار حاشیه‌نویسی متن', 'اعتبارسنجی فرمت متن',
    'فشرده‌سازی متن', 'رمزنگاری متن', 'واترمارکینگ متنی', 'پلتفرم سازمانی کامل NLP'
  ];

  const categories: Array<'api' | 'tool' | 'library' | 'platform'> = ['api', 'tool', 'library', 'platform'];
  const pricingModels: Array<'free' | 'freemium' | 'paid' | 'enterprise'> = ['free', 'freemium', 'paid', 'enterprise'];
  const statuses: Array<'active' | 'beta' | 'maintenance'> = ['active', 'beta', 'maintenance'];
  const languages = ['فارسی', 'انگلیسی', 'عربی', 'ترکی', 'آلمانی', 'فرانسوی'];
  
  const services: NLPService[] = [];

  for (let i = 1; i <= 28; i++) {
    const category = categories[i % 4];
    const pricing = pricingModels[i % 4];
    const status = i > 25 ? 'maintenance' : statuses[i % 3];
    
    services.push({
      id: i,
      name: serviceNames[i - 1],
      description: descriptions[i - 1],
      category,
      pricing,
      endpoint: `https://api.tetrashop.com/v1/service-${i}`,
      rateLimit: i % 4 === 0 ? 'نامحدود' : `${(i * 1000).toLocaleString()} درخواست در روز`,
      uptime: 99.5 + (i % 10) * 0.05,
      features: [
        'API کامل RESTful',
        'مستندات فارسی کامل',
        'پشتیبانی 24/7',
        i % 3 === 0 ? 'امنیت سطح بالا' : 'سرعت پردازش بالا',
        i % 2 === 0 ? 'قابل مقیاس‌پذیری' : 'داکت‌شده',
        'پشتیبانی از فرمت‌های مختلف'
      ],
      languages: [languages[i % 6], languages[(i + 1) % 6]],
      documentation: `https://docs.tetrashop.com/service-${i}`,
      status,
      lastUpdated: `2024-0${Math.floor(i / 10) + 1}-${(i % 28) + 1}`,
      usage: {
        requests: Math.floor(Math.random() * 5000000) + 1000000,
        users: Math.floor(Math.random() * 10000) + 1000,
        satisfaction: 85 + (i % 15)
      }
    });
  }

  return services;
};

// تولید 28 سرویس
export const nlpServices: NLPService[] = generateServices();

// گروه‌بندی سرویس‌ها
export const serviceCategories = {
  api: nlpServices.filter(s => s.category === 'api'),
  tool: nlpServices.filter(s => s.category === 'tool'),
  library: nlpServices.filter(s => s.category === 'library'),
  platform: nlpServices.filter(s => s.category === 'platform')
};

// توابع کمکی
export function getServiceById(id: number): NLPService | null {
  return nlpServices.find(service => service.id === id) || null;
}

export function getServicesByCategory(category: string): NLPService[] {
  return nlpServices.filter(service => service.category === category);
}

export const totalServices = nlpServices.length;

// اطلاعات آماری کلی
export const serviceStats = {
  totalServices: nlpServices.length,
  totalRequests: nlpServices.reduce((sum, s) => sum + s.usage.requests, 0),
  totalUsers: nlpServices.reduce((sum, s) => sum + s.usage.users, 0),
  avgUptime: nlpServices.reduce((sum, s) => sum + s.uptime, 0) / nlpServices.length,
  avgSatisfaction: nlpServices.reduce((sum, s) => sum + s.usage.satisfaction, 0) / nlpServices.length
};
