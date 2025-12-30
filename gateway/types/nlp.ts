// انواع TypeScript برای سرویس‌های NLP
export interface NLPService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  version: string;
  category: 'تحلیل' | 'استخراج' | 'تبدیل' | 'خلاصه‌سازی' | 'تشخیص' | 'تصحیح' | 'پیش‌پردازش';
  icon: string;
  color: string;
  status: 'active' | 'maintenance' | 'beta';
  rateLimit: number;
  latency: number;
  tags: string[];
  inputType: 'text' | 'file' | 'both';
  outputType: 'json' | 'text' | 'html' | 'csv';
  requiresAuth: boolean;
}

export interface NLPRequest {
  text: string;
  serviceId: string;
  action?: string;
  options?: Record<string, any>;
}

export interface NLPResponse {
  success: boolean;
  data: any;
  processingTime: number;
  serviceId: string;
  timestamp: string;
  error?: string;
}

export interface ServiceStatus {
  serviceId: string;
  status: 'online' | 'offline' | 'slow';
  latency: number;
  lastChecked: string;
  uptime: number;
}

export interface DashboardStats {
  totalServices: number;
  activeServices: number;
  totalRequests: number;
  averageLatency: number;
  popularServices: string[];
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}
