'use client';

import React, { useState, useEffect } from 'react';
import { services } from '../servicesData';

interface ServiceStatus {
  id: string;
  name: string;
  endpoint: string;
  status: 'online' | 'offline' | 'error';
  latency: number;
  lastChecked: string;
  color: string;
  error?: string;
}

interface Stats {
  online: number;
  offline: number;
  total: number;
  avgLatency: number;
  lastUpdate: string;
}

interface GatewayMonitorProps {
  initialService?: string;
  title?: string;
}

const GatewayMonitor: React.FC<GatewayMonitorProps> = ({ 
  initialService, 
  title = 'وضعیت گیت‌وی‌ها' 
}) => {
  const [selectedService, setSelectedService] = useState<string>(initialService || 'all');
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAllServices = async () => {
    setLoading(true);
    const serviceChecks: ServiceStatus[] = await Promise.all(
      services.map(async (service) => {
        const startTime = Date.now();
        try {
          const response = await fetch(service.endpoint, {
            method: 'HEAD',
            cache: 'no-cache'
          });
          const latency = Date.now() - startTime;
          
          return {
            id: service.id,
            name: service.name,
            endpoint: service.endpoint,
            status: response.ok ? 'online' : 'error',
            latency,
            lastChecked: new Date().toLocaleTimeString('fa-IR'),
            color: service.color
          };
        } catch (error) {
          return {
            id: service.id,
            name: service.name,
            endpoint: service.endpoint,
            status: 'error',
            latency: 0,
            lastChecked: new Date().toLocaleTimeString('fa-IR'),
            color: service.color,
            error: error instanceof Error ? error.message : 'خطای ناشناخته'
          };
        }
      })
    );

    setServiceStatuses(serviceChecks);
    updateStats(serviceChecks);
    setLastUpdate(new Date().toLocaleTimeString('fa-IR'));
    setLoading(false);
  };

  const updateStats = (serviceChecks: ServiceStatus[]) => {
    const online = serviceChecks.filter(s => s.status === 'online').length;
    const offline = serviceChecks.filter(s => s.status !== 'online').length;
    const total = serviceChecks.length;
    const avgLatency = Math.round(
      serviceChecks
        .filter(s => s.status === 'online')
        .reduce((acc, s) => acc + s.latency, 0) / online || 0
    );

    setStats({
      online,
      offline,
      total,
      avgLatency,
      lastUpdate: new Date().toLocaleString('fa-IR')
    });
  };

  const testGateway = async (serviceId: string, endpoint: string) => {
    try {
      const startTime = Date.now();
      const response = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-cache'
      });
      const latency = Date.now() - startTime;

      if (response.ok) {
        alert(`✅ سرویس ${serviceId} فعال است!\nزمان پاسخ: ${latency}ms`);
      } else {
        alert(`⚠️ سرویس ${serviceId} پاسخ داد اما با خطا: ${response.status}`);
      }
    } catch (error) {
      alert(`❌ خطا در ${serviceId}: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    }
  };

  const filteredServices = selectedService === 'all' 
    ? serviceStatuses 
    : serviceStatuses.filter(s => s.id === selectedService);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-2"
          >
            <option value="all">همه سرویس‌ها</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={checkAllServices}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : 'بررسی مجدد'}
          </button>
        </div>
      </div>

      {/* آمار کلی */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-green-600 dark:text-green-400 text-sm">آنلاین</div>
            <div className="text-2xl font-bold">
              {stats.online}/{stats.total}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-blue-600 dark:text-blue-400 text-sm">میانگین تأخیر</div>
            <div className="text-2xl font-bold">
              {stats.avgLatency}ms
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-red-600 dark:text-red-400 text-sm">آفلاین</div>
            <div className="text-2xl font-bold">
              {stats.offline}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-purple-600 dark:text-purple-400 text-sm">آخرین بروزرسانی</div>
            <div className="text-lg font-bold">
              {lastUpdate}
            </div>
          </div>
        </div>
      )}

      {/* لیست سرویس‌ها */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'online' ? 'bg-green-500 animate-pulse' :
                  service.status === 'error' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{service.endpoint}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">آخرین بررسی</div>
                  <div>{service.lastChecked}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">وضعیت</div>
                  <div className={`font-bold ${
                    service.status === 'online' ? 'text-green-600' :
                    service.status === 'error' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {service.status === 'online' ? `${service.latency}ms` : 'غیرفعال'}
                  </div>
                </div>
                
                <button
                  onClick={() => testGateway(service.id, service.endpoint)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  تست
                </button>
              </div>
            </div>
            
            {service.error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                خطا: {service.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GatewayMonitor;
