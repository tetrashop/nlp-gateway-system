'use client';

import React, { useState, useEffect } from 'react';
import { NLPService } from '../../types/nlp';

interface ServiceStatsProps {
  services: NLPService[];
}

const ServiceStats: React.FC<ServiceStatsProps> = ({ services }) => {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    averageLatency: 0,
    totalRateLimit: 0,
    categories: {} as Record<string, number>
  });

  useEffect(() => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.status === 'active').length;
    const averageLatency = Math.round(
      services.reduce((acc, s) => acc + s.latency, 0) / totalServices
    );
    const totalRateLimit = services.reduce((acc, s) => acc + s.rateLimit, 0);
    
    const categories: Record<string, number> = {};
    services.forEach(service => {
      categories[service.category] = (categories[service.category] || 0) + 1;
    });

    setStats({
      totalServices,
      activeServices,
      averageLatency,
      totalRateLimit,
      categories
    });
  }, [services]);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold mb-4">📊 آمار لحظه‌ای سرویس‌ها</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.totalServices}</div>
          <div className="text-xs opacity-90">کل سرویس‌ها</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.activeServices}</div>
          <div className="text-xs opacity-90">سرویس فعال</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.averageLatency}ms</div>
          <div className="text-xs opacity-90">میانگین تأخیر</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(stats.totalRateLimit / 1000)}K</div>
          <div className="text-xs opacity-90">درخواست/ساعت</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-sm opacity-90 mb-2">توزیع بر اساس دسته:</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.categories).map(([category, count]) => (
            <span 
              key={category}
              className="px-3 py-1 bg-white/20 rounded-full text-xs"
            >
              {category}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceStats;
