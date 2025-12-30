export interface NlpService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  version: string;
  category: string;
  tags: string[];
  rateLimit: number;
  latency: number;
  status: 'active' | 'beta' | 'maintenance';
}

// ایجاد ۲۶۰ سرویس NLP (برای آخرین پست صفحه)
const createNlpServices = () => {
  const baseServices = [
    {
      id: "text-analysis",
      name: "تحلیل متن فارسی",
      description: "تحلیل جامع متن فارسی شامل آمار و اطلاعات آماری",
      endpoint: "/api/nlp/analyze",
      version: "2.1.0",
      category: "تحلیل",
      tags: ["تحلیل", "آمار", "پردازش"],
      rateLimit: 1000,
      latency: 150,
      status: "active" as const
    },
    {
      id: "keyword-extraction",
      name: "استخراج کلیدواژه",
      description: "استخراج خودکار کلیدواژه‌های مهم از متن فارسی",
      endpoint: "/api/nlp/keywords",
      version: "1.8.0",
      category: "استخراج",
      tags: ["کلیدواژه", "تگ", "کلمات کلیدی"],
      rateLimit: 800,
      latency: 200,
      status: "active" as const
    },
    {
      id: "sentiment-analysis",
      name: "تحلیل احساسات",
      description: "تشخیص احساسات مثبت، منفی و خنثی در متن فارسی",
      endpoint: "/api/nlp/sentiment",
      version: "2.0.0",
      category: "تحلیل",
      tags: ["احساسات", "عاطفه", "نگرش"],
      rateLimit: 1200,
      latency: 180,
      status: "active" as const
    },
    {
      id: "text-summarization",
      name: "خلاصه‌سازی متن",
      description: "خلاصه‌سازی هوشمند متن‌های طولانی فارسی",
      endpoint: "/api/nlp/summarize",
      version: "1.5.0",
      category: "خلاصه‌سازی",
      tags: ["خلاصه", "فشرده‌سازی", "متن کوتاه"],
      rateLimit: 600,
      latency: 300,
      status: "active" as const
    },
    {
      id: "pos-tagging",
      name: "برچسب‌گذاری اجزای کلام",
      description: "تشخیص نقش کلمات در جمله فارسی",
      endpoint: "/api/nlp/pos",
      version: "1.9.0",
      category: "تحلیل",
      tags: ["دستور زبان", "نحو", "نقش کلمات"],
      rateLimit: 1500,
      latency: 120,
      status: "active" as const
    },
    {
      id: "ner",
      name: "تشخیص موجودیت‌های نامدار",
      description: "تشخیص اسامی خاص، مکان‌ها، سازمان‌ها و تاریخ‌ها",
      endpoint: "/api/nlp/ner",
      version: "2.2.0",
      category: "تشخیص",
      tags: ["NER", "موجودیت", "اسامی خاص"],
      rateLimit: 900,
      latency: 250,
      status: "active" as const
    },
    {
      id: "dependency-parser",
      name: "تجزیه وابستگی",
      description: "تحلیل روابط وابستگی بین کلمات در جمله فارسی",
      endpoint: "/api/nlp/dependency",
      version: "1.7.0",
      category: "تحلیل",
      tags: ["گرامر", "روابط", "ساختار جمله"],
      rateLimit: 700,
      latency: 350,
      status: "beta" as const
    },
    {
      id: "spell-checker",
      name: "تصحیح غلط‌های املایی",
      description: "تشخیص و تصحیح خودکار غلط‌های املایی فارسی",
      endpoint: "/api/nlp/spell",
      version: "2.3.0",
      category: "تصحیح",
      tags: ["املاء", "غلط‌یابی", "تصحیح"],
      rateLimit: 2000,
      latency: 100,
      status: "active" as const
    },
    {
      id: "text-normalization",
      name: "نرمال‌سازی متن",
      description: "یکسان‌سازی و پاک‌سازی متن فارسی",
      endpoint: "/api/nlp/normalize",
      version: "1.6.0",
      category: "پیش‌پردازش",
      tags: ["پاک‌سازی", "نرمال", "یکسان‌سازی"],
      rateLimit: 2500,
      latency: 80,
      status: "active" as const
    },
    {
      id: "word-embedding",
      name: "نمایش برداری کلمات",
      description: "تبدیل کلمات به بردارهای عددی برای پردازش ماشین",
      endpoint: "/api/nlp/embedding",
      version: "1.4.0",
      category: "تبدیل",
      tags: ["بردار", "کلمه", "فضای برداری"],
      rateLimit: 500,
      latency: 400,
      status: "active" as const
    }
  ];

  const services: NlpService[] = [];
  
  // ایجاد ۲۶۰ سرویس (برای آخرین پست صفحه NLP)
  for (let i = 0; i < 260; i++) {
    const baseIndex = i % baseServices.length;
    const base = baseServices[baseIndex];
    
    services.push({
      id: `${base.id}-${i + 1}`,
      name: `${base.name} ${i + 1}`,
      description: `${base.description} (نسخه ${i + 1})`,
      endpoint: `${base.endpoint}/${i + 1}`,
      version: `1.${i % 10}.${i % 100}`,
      category: base.category || "عمومی",
      tags: [...(base.tags || []), `سرویس-${i + 1}`],
      rateLimit: base.rateLimit || 1000,
      latency: base.latency || 200,
      status: i % 20 === 0 ? 'beta' : i % 50 === 0 ? 'maintenance' : 'active'
    });
  }
  
  return services;
};

export const nlpServices: NlpService[] = createNlpServices();

export const getNlpServiceById = (id: string): NlpService | undefined => {
  return nlpServices.find(service => service.id === id);
};

export const getNlpServiceByIndex = (index: number): NlpService | undefined => {
  return nlpServices[index];
};

export const getNlpServicesByCategory = (category: string): NlpService[] => {
  return nlpServices.filter(service => service.category === category);
};

export const getTotalNlpServices = (): number => {
  return nlpServices.length; // ۲۶۰
};

console.log(`📊 تعداد سرویس‌های NLP: ${nlpServices.length}`);
