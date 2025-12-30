/**
 * کلاینت یکپارچه برای ارتباط با Gateway
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';
const GATEWAY_TIMEOUT = 30000; // 30 ثانیه

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * کلاس اصلی کلاینت API
 */
class ApiClient {
  constructor(baseURL = API_BASE, options = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || GATEWAY_TIMEOUT;
    this.withCredentials = options.withCredentials || false;
  }

  /**
   * تنظیم توکن احراز هویت
   */
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * تنظیم هدر سفارشی
   */
  setHeader(key, value) {
    this.defaultHeaders[key] = value;
  }

  /**
   * متد عمومی برای ارسال درخواست
   */
  async request(method, service, path, data = null, options = {}) {
    const url = `${this.baseURL}/${service}/${path}`;
    const headers = { ...this.defaultHeaders, ...options.headers };
    
    const config = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
      credentials: this.withCredentials ? 'include' : 'same-origin',
      ...options
    };

    if (data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      if (data instanceof FormData) {
        delete headers['Content-Type']; // اجازه می‌دهد مرورگر هدر را تنظیم کند
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, config);
      
      // پردازش پاسخ
      const contentType = response.headers.get('content-type') || '';
      let responseData;
      
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        responseData = await response.blob();
      }

      if (!response.ok) {
        throw new ApiError(
          responseData?.error || `خطای ${response.status}`,
          response.status,
          responseData
        );
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
        headers: response.headers
      };

    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new ApiError('درخواست زمان‌بر شد. لطفاً دوباره تلاش کنید.', 408);
      } else if (error.name === 'ApiError') {
        throw error;
      } else {
        console.error('API Request Error:', error);
        throw new ApiError('خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.', 0);
      }
    }
  }

  // متدهای کمکی
  async get(service, path, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    return this.request('GET', service, fullPath, null, options);
  }

  async post(service, path, data = {}, options = {}) {
    return this.request('POST', service, path, data, options);
  }

  async put(service, path, data = {}, options = {}) {
    return this.request('PUT', service, path, data, options);
  }

  async patch(service, path, data = {}, options = {}) {
    return this.request('PATCH', service, path, data, options);
  }

  async delete(service, path, data = {}, options = {}) {
    return this.request('DELETE', service, path, data, options);
  }

  /**
   * آپلود فایل
   */
  async upload(service, path, file, fieldName = 'file', additionalData = {}) {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request('POST', service, path, formData, {
      headers: {} // هدرها به صورت خودکار تنظیم می‌شوند
    });
  }

  /**
   * دانلود فایل
   */
  async download(service, path, params = {}) {
    const response = await this.get(service, path, params, {
      headers: { 'Accept': 'application/octet-stream' }
    });
    
    // ایجاد لینک دانلود برای blob
    if (response.data instanceof Blob) {
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
    
    return response;
  }
}

// نمونه‌های آماده برای سرویس‌های مختلف
export const apiClient = new ApiClient();

// کلاینت‌های تخصصی
export const authClient = {
  login: (credentials) => apiClient.post('auth', 'login', credentials),
  register: (userData) => apiClient.post('auth', 'register', userData),
  logout: () => apiClient.post('auth', 'logout'),
  verify: (token) => apiClient.get('auth', 'verify', { token })
};

export const userClient = {
  getProfile: (userId) => apiClient.get('users', `profiles/${userId}`),
  updateProfile: (userId, data) => apiClient.put('users', `profiles/${userId}`, data),
  listUsers: (params) => apiClient.get('users', 'list', params)
};

export const documentClient = {
  processText: (text, options) => apiClient.post('documents', 'process/text', { text, ...options }),
  summarize: (document, options) => apiClient.post('documents', 'summarize', { document, ...options }),
  translate: (text, targetLang) => apiClient.post('documents', 'translate', { text, targetLang }),
  extractEntities: (text) => apiClient.post('nlp', 'entities', { text })
};

export const aiClient = {
  analyzeSentiment: (text) => apiClient.post('ai', 'sentiment', { text }),
  classify: (text, categories) => apiClient.post('ai', 'classify', { text, categories }),
  generateEmbeddings: (texts) => apiClient.post('ai', 'embeddings', { texts }),
  chat: (messages) => apiClient.post('ai', 'chat', { messages })
};

export const paymentClient = {
  createInvoice: (invoiceData) => apiClient.post('payments', 'invoices/create', invoiceData),
  processPayment: (paymentData) => apiClient.post('payments', 'process', paymentData),
  getTransactions: (params) => apiClient.get('payments', 'transactions', params)
};

// اکسپورت پیش‌فرض
export default apiClient;
