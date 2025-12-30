'use client';

import React from 'react';
import { NLPService } from '../../types/nlp';

interface ServiceCardProps {
  service: NLPService;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      {/* هدر کارت */}
      <div className={`${service.color} p-4`}>
        <div className="flex justify-between items-start">
          <div className="text-3xl">{service.icon}</div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            service.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : service.status === 'beta'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }`}>
            {service.status === 'active' ? 'فعال' : service.status === 'beta' ? 'بتا' : 'تعمیرات'}
          </span>
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
          {service.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* تگ‌ها */}
        <div className="flex flex-wrap gap-1 mb-4">
          {service.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {service.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
              +{service.tags.length - 3}
            </span>
          )}
        </div>

        {/* آمار سرویس */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-500">ورژن</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {service.version}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-500">تأخیر</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {service.latency}ms
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-500">محدودیت</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {service.rateLimit}/ساعت
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-500">ورودی</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {service.inputType === 'text' ? 'متن' : service.inputType === 'file' ? 'فایل' : 'هر دو'}
            </div>
          </div>
        </div>

        {/* دکمه اقدام */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 py-2 rounded-lg font-medium transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50">
            استفاده از سرویس →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
