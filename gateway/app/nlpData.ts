/**
 * داده‌های پروژه‌های NLP - 256 پروژه
 * تولید شده به صورت دینامیک
 */

export interface NLPProject {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  author: string;
  category: string;
  rating: number;
  progress: number;
  features: string[];
  apiEndpoint?: string;
  documentationUrl?: string;
  githubUrl?: string;
  lastUpdated: string;
  tags: string[];
  usageExamples: string[];
  apiKeyRequired: boolean;
  starCount?: number;
  downloadCount?: number;
  version?: string;
}

// پروژه‌های نمونه (20 پروژه اول با جزئیات کامل)
const sampleProjects: NLPProject[] = [
  {
    id: 1,
    title: "پردازشگر هوشمند متن فارسی",
    description: "سیستم جامع تحلیل و پردازش متن‌های فارسی با قابلیت‌های پیشرفته",
    detailedDescription: "این پروژه یک چارچوب کامل برای پردازش متن‌های فارسی ارائه می‌دهد که شامل توکنایزینگ، نرمال‌سازی، ریشه‌یابی و استخراج ویژگی‌های زبانی می‌شود. از معماری‌های مبتنی بر Transformer استفاده می‌کند.",
    author: "دکتر علی محمدی",
    category: "پردازش متن",
    rating: 4.7,
    progress: 100,
    features: [
      "توکنایزینگ پیشرفته فارسی",
      "ریشه‌یابی کلمات",
      "حذف حروف ربط",
      "استخراج ویژگی‌های نحوی",
      "پشتیبانی از دیتاست‌های بزرگ"
    ],
    apiEndpoint: "/api/v1/text-processor",
    documentationUrl: "/docs/text-processor",
    githubUrl: "https://github.com/tetrashop/text-processor",
    lastUpdated: "2024-03-15",
    tags: ["پردازش متن", "فارسی", "هوش مصنوعی"],
    usageExamples: ["پیش‌پردازش داده‌های متنی", "آماده‌سازی برای مدل‌های NLP"],
    apiKeyRequired: false,
    starCount: 1245,
    downloadCount: 8900,
    version: "v2.1.0"
  },
  // 19 پروژه نمونه دیگر...
  {
    id: 20,
    title: "تحلیلگر احساسات پیشرفته",
    description: "سیستم تحلیل احساسات متن‌های فارسی با دقت بالا",
    detailedDescription: "مدل تحلیل احساسات مبتنی بر BERT که روی دیتاست بزرگی از نظرات فارسی آموزش دیده و قادر به تشخیص ۷ حالت احساسی مختلف است.",
    author: "پژوهشگاه علوم انسانی",
    category: "تحلیل احساسات",
    rating: 4.8,
    progress: 95,
    features: [
      "تشخیص ۷ حالت احساسی",
      "پشتیبانی از اصطلاحات محاوره",
      "تحلیل لحن متن",
      "خروجی احتمالاتی",
      "API ریست‌فول"
    ],
    apiEndpoint: "/api/v1/sentiment",
    documentationUrl: "/docs/sentiment",
    lastUpdated: "2024-03-10",
    tags: ["تحلیل احساسات", "فارسی", "BERT"],
    usageExamples: ["تحلیل نظرات کاربران", "مانیتورینگ برند"],
    apiKeyRequired: true,
    starCount: 876,
    downloadCount: 5400
  }
];

// تابع تولید پروژه‌های دینامیک (پروژه‌های 21 تا 256)
function generateDynamicProjects(): NLPProject[] {
  const projects: NLPProject[] = [];
  const categories = [
    'پردازش متن', 'ترجمه ماشینی', 'تحلیل احساسات', 
    'پاسخ‌گویی به سوالات', 'تولید متن', 'خلاصه‌سازی',
    'تشخیص موجودیت', 'دسته‌بندی متن'
  ];
  
  const featuresPool = [
    'API کامل RESTful', 'مستندات فارسی', 'پشتیبانی بلندمدت',
    'مقیاس‌پذیر', 'امنیت بالا', 'سرعت پردازش بالا',
    'پشتیبانی از فرمت‌های مختلف', 'داکت‌شده', 'قابل استقرار روی سرور داخلی'
  ];

  for (let i = 21; i <= 256; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const progress = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    projects.push({
      id: i,
      title: `پروژه NLP شماره ${i}`,
      description: `توضیحات مختصر برای پروژه پردازش زبان طبیعی شماره ${i}`,
      detailedDescription: `این پروژه یک سیستم ${category} است که برای کاربردهای مختلف صنعتی و تحقیقاتی توسعه یافته.`,
      author: `تیم تحقیقاتی ${Math.floor(Math.random() * 100) + 1}`,
      category,
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      progress,
      features: featuresPool.slice(0, Math.floor(Math.random() * 4) + 3),
      apiEndpoint: `/api/v1/project-${i}`,
      documentationUrl: `/docs/project-${i}`,
      githubUrl: `https://github.com/tetrashop/project-${i}`,
      lastUpdated: `2024-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      tags: ['NLP', 'هوش مصنوعی', category],
      usageExamples: ['پردازش متن', 'تحلیل داده', 'اتوماسیون'],
      apiKeyRequired: Math.random() > 0.4,
      starCount: Math.floor(Math.random() * 1000),
      downloadCount: Math.floor(Math.random() * 10000)
    });
  }
  
  return projects;
}

// پروژه ویژه 256
const specialProject256: NLPProject = {
  id: 256,
  title: "سامانه هوشمند پاسخ‌گویی به پرسش‌های پیچیده",
  description: "پیشرفته‌ترین سیستم QA برای پاسخ به سوالات تخصصی با دقت ۹۵٪",
  detailedDescription: "آخرین و پیشرفته‌ترین پروژه NLP ما که از معماری Mixture of Experts استفاده می‌کند. این سیستم قادر به پاسخ‌گویی به سوالات پیچیده در حوزه‌های پزشکی، حقوقی، فنی و علوم انسانی است.",
  author: "آزمایشگاه هوش مصنوعی پیشرفته تتراشاپ",
  category: "پاسخ‌گویی به سوالات",
  rating: 4.9,
  progress: 98,
  features: [
    "پاسخ‌گویی چندحوزه‌ای",
    "ارجاع به منابع معتبر",
    "یادگیری تطبیقی",
    "پشتیبانی از ۵ زبان",
    "سیستم اعتبارسنجی پاسخ‌ها",
    "لاگ‌گیری کامل"
  ],
  apiEndpoint: "/api/v1/qa-advanced",
  documentationUrl: "/docs/qa-advanced",
  githubUrl: "https://github.com/tetrashop/qa-advanced",
  lastUpdated: "2024-03-20",
  tags: ["QA", "پیشرفته", "چندحوزه‌ای", "هوش مصنوعی", "فارسی"],
  usageExamples: [
    "پاسخ به سوالات پزشکی",
    "مشاوره حقوقی اولیه",
    "پاسخ به سوالات فنی",
    "آموزش تعاملی",
    "پشتیبانی مشتریان"
  ],
  apiKeyRequired: true,
  starCount: 2547,
  downloadCount: 18500,
  version: "v3.0.0"
};

// ترکیب همه پروژه‌ها
const dynamicProjects = generateDynamicProjects();
export const nlpProjects: NLPProject[] = [
  ...sampleProjects,
  ...dynamicProjects.slice(0, 235), // تا پروژه 255
  specialProject256 // پروژه 256
];

// توابع کمکی
export function getProjectById(id: number): NLPProject | null {
  return nlpProjects.find(project => project.id === id) || null;
}

export function getAllProjects(): NLPProject[] {
  return nlpProjects;
}

export function getProjectsByCategory(category: string): NLPProject[] {
  return nlpProjects.filter(project => 
    project.category === category
  );
}

export function searchProjects(query: string): NLPProject[] {
  const searchTerm = query.toLowerCase();
  return nlpProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getLatestProjects(count: number = 10): NLPProject[] {
  return [...nlpProjects]
    .sort((a, b) => b.id - a.id)
    .slice(0, count);
}

export function getPopularProjects(count: number = 10): NLPProject[] {
  return [...nlpProjects]
    .sort((a, b) => (b.starCount || 0) - (a.starCount || 0))
    .slice(0, count);
}

export const totalProjects = nlpProjects.length;
export const lastProjectId = 256;
