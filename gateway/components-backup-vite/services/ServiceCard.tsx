import React, { useState, useEffect } from 'react';
import { NLPService } from '@/app/servicesData';
import { Activity, Users, Zap, Shield } from 'lucide-react'; // Users را اضافه کردیم

interface ServiceCardProps {
  service: NLPService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatNumberSafely = (num: number) => {
    if (!isClient) return num.toLocaleString('en-US');
    return num.toLocaleString('fa-IR');
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'رایگان';
      case 'freemium': return 'Freemium';
      case 'paid': return 'پولی';
      case 'enterprise': return 'سازمانی';
      default: return pricing;
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* هدر سرویس */}
      <div className="relative h-40 bg-gradient-to-r from-cyan-500 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
        <div className="absolute top-4 left-4">
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getPricingColor(service.pricing)}`}>
            {getPricingText(service.pricing)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">{service.name}</h3>
          <p className="text-white/90 text-sm mt-1">{service.description}</p>
        </div>
      </div>

      {/* اطلاعات سرویس */}
      <div className="p-6">
        {/* آمار سریع */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-semibold">{service.uptime}%</div>
              <div className="text-xs text-gray-500">آپتایم</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-semibold">{formatNumberSafely(service.usage.users)}</div>
              <div className="text-xs text-gray-500">کاربر</div>
            </div>
          </div>
        </div>

        {/* ویژگی‌ها */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">ویژگی‌های کلیدی</h4>
          <div className="flex flex-wrap gap-2">
            {service.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {feature}
              </span>
            ))}
            {service.features.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                +{service.features.length - 3} بیشتر
              </span>
            )}
          </div>
        </div>

        {/* اطلاعات فنی */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>محدودیت درخواست:</span>
            <span className="font-medium">{service.rateLimit}</span>
          </div>
          <div className="flex justify-between">
            <span>وضعیت:</span>
            <span className={`font-medium ${
              service.status === 'active' ? 'text-green-600' : 
              service.status === 'beta' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {service.status === 'active' ? 'فعال' : 
               service.status === 'beta' ? 'نسخه آزمایشی' : 'در تعمیرات'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>زبان‌ها:</span>
            <span className="font-medium">{service.languages.join('، ')}</span>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="mt-8 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            مستندات
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition">
            تست API
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
