export interface Service {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  version: string;
  category: string;
  color: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  latency: number;
}

export const services: Service[] = [
  {
    id: "gateway-main",
    name: "گیت‌وی اصلی",
    description: "گیت‌وی مرکزی برای مسیریابی درخواست‌ها",
    endpoint: "https://api.example.com/gateway",
    version: "3.0.0",
    category: "infrastructure",
    color: "bg-blue-500",
    status: "online",
    uptime: 99.9,
    latency: 45
  },
  {
    id: "nlp-processor",
    name: "پردازنده NLP",
    description: "موتور اصلی پردازش زبان طبیعی",
    endpoint: "https://api.example.com/nlp",
    version: "2.1.0",
    category: "nlp",
    color: "bg-green-500",
    status: "online",
    uptime: 99.8,
    latency: 120
  },
  {
    id: "auth-service",
    name: "سرویس احراز هویت",
    description: "مدیریت کاربران و احراز هویت",
    endpoint: "https://api.example.com/auth",
    version: "1.5.0",
    category: "security",
    color: "bg-purple-500",
    status: "online",
    uptime: 99.95,
    latency: 60
  },
  {
    id: "database-proxy",
    name: "پراکسی پایگاه داده",
    description: "مدیریت ارتباط با پایگاه‌های داده",
    endpoint: "https://api.example.com/db",
    version: "2.0.0",
    category: "database",
    color: "bg-yellow-500",
    status: "online",
    uptime: 99.7,
    latency: 80
  },
  {
    id: "cache-layer",
    name: "لایه کش",
    description: "مدیریت کش برای بهبود عملکرد",
    endpoint: "https://api.example.com/cache",
    version: "1.8.0",
    category: "performance",
    color: "bg-red-500",
    status: "online",
    uptime: 99.6,
    latency: 20
  },
  {
    id: "monitoring",
    name: "سرویس مانیتورینگ",
    description: "مانیتورینگ لحظه‌ای سرویس‌ها",
    endpoint: "https://api.example.com/monitor",
    version: "1.2.0",
    category: "monitoring",
    color: "bg-indigo-500",
    status: "online",
    uptime: 99.99,
    latency: 30
  },
  {
    id: "logging",
    name: "سرویس لاگ",
    description: "ثبت و مدیریت لاگ‌های سیستم",
    endpoint: "https://api.example.com/logs",
    version: "1.3.0",
    category: "monitoring",
    color: "bg-gray-500",
    status: "online",
    uptime: 99.8,
    latency: 40
  },
  {
    id: "notification",
    name: "سرویس اعلان",
    description: "ارسال اعلان‌ها و هشدارها",
    endpoint: "https://api.example.com/notify",
    version: "1.1.0",
    category: "communication",
    color: "bg-pink-500",
    status: "online",
    uptime: 99.5,
    latency: 100
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};

export const getTotalServices = (): number => {
  return services.length;
};

export const getOnlineServices = (): Service[] => {
  return services.filter(service => service.status === 'online');
};

export const getServiceStatus = (id: string): 'online' | 'offline' | 'maintenance' => {
  const service = getServiceById(id);
  return service ? service.status : 'offline';
};

console.log(`📊 تعداد سرویس‌های گیت‌وی: ${services.length}`);
