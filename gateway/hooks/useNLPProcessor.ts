'use client';

import { useState, useCallback } from 'react';
import { NLPRequest, NLPResponse } from '../types/nlp';
import { nlpServices } from '../data/nlpServices';

export const useNLPProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<NLPResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<NLPResponse[]>([]);

  const processText = useCallback(async (request: NLPRequest) => {
    setProcessing(true);
    setError(null);
    
    try {
      const service = nlpServices.find(s => s.id === request.serviceId);
      if (!service) {
        throw new Error('سرویس مورد نظر یافت نشد');
      }

      // شبیه‌سازی API call
      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          action: request.action,
          options: request.options,
        }),
      });

      if (!response.ok) {
        throw new Error(`خطا در ارتباط با سرویس: ${response.status}`);
      }

      const data = await response.json();
      
      const nlpResponse: NLPResponse = {
        success: true,
        data,
        processingTime: Math.random() * 500 + 100, // شبیه‌سازی زمان پردازش
        serviceId: request.serviceId,
        timestamp: new Date().toISOString(),
      };

      setResult(nlpResponse);
      setHistory(prev => [nlpResponse, ...prev.slice(0, 9)]); // حفظ ۱۰ مورد آخر
      
      return nlpResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته';
      setError(errorMessage);
      setResult({
        success: false,
        data: null,
        processingTime: 0,
        serviceId: request.serviceId,
        timestamp: new Date().toISOString(),
        error: errorMessage,
      });
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    processing,
    result,
    error,
    history,
    processText,
    clearResult,
    clearHistory,
  };
};
