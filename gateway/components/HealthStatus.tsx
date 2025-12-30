'use client';

import React, { useState, useEffect } from 'react';

const HealthStatus = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'API Gateway', status: 'online', uptime: '99.9%' },
    { id: 2, name: 'Auth Service', status: 'online', uptime: '99.8%' },
    { id: 3, name: 'NLP Engine', status: 'online', uptime: '99.7%' },
    { id: 4, name: 'Database', status: 'online', uptime: '99.9%' },
    { id: 5, name: 'Cache', status: 'online', uptime: '99.9%' },
    { id: 6, name: 'File Storage', status: 'warning', uptime: '98.5%' },
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">وضعیت سرویس‌ها</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
          همه سیستم‌ها فعال
        </span>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-green-500' : service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-gray-800 dark:text-gray-200">{service.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">آپتایم: {service.uptime}</div>
              <div className={`text-xs ${service.status === 'online' ? 'text-green-600' : service.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                {service.status === 'online' ? 'فعال' : service.status === 'warning' ? 'هشدار' : 'غیرفعال'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthStatus;
