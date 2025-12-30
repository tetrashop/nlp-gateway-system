import { NLPService } from '../../types/nlp';

export class RoundRobinLoadBalancer {
  private services: Map<string, NLPService[]>;
  private pointers: Map<string, number>;

  constructor() {
    this.services = new Map();
    this.pointers = new Map();
  }

  // ثبت سرویس‌ها
  registerService(serviceId: string, instances: NLPService[]) {
    this.services.set(serviceId, instances);
    this.pointers.set(serviceId, 0);
  }

  // انتخاب سرویس بعدی با الگوریتم Round Robin
  getNextService(serviceId: string): NLPService | null {
    const instances = this.services.get(serviceId);
    if (!instances || instances.length === 0) {
      return null;
    }

    const pointer = this.pointers.get(serviceId) || 0;
    const selectedService = instances[pointer % instances.length];
    
    // افزایش اشاره‌گر برای درخواست بعدی
    this.pointers.set(serviceId, pointer + 1);
    
    return selectedService;
  }

  // بررسی وضعیت سرویس‌ها
  getServiceHealth(serviceId: string): { total: number; healthy: number } {
    const instances = this.services.get(serviceId) || [];
    const healthy = instances.filter(service => service.status === 'active').length;
    
    return { total: instances.length, healthy };
  }

  // حذف سرویس ناسالم
  removeUnhealthyService(serviceId: string, instanceId: string) {
    const instances = this.services.get(serviceId);
    if (instances) {
      const filtered = instances.filter(instance => instance.id !== instanceId);
      this.services.set(serviceId, filtered);
    }
  }
}

// ایجاد نمونه Singleton
export const loadBalancer = new RoundRobinLoadBalancer();
