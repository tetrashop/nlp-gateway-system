import React from 'react';
import Link from 'next/link';
import { Cpu, Home, Database, Shield, Zap } from 'lucide-react';

const ServicesHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* لوگو */}
          <Link href="/services" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tetrashop Services
              </h1>
              <p className="text-xs text-gray-500">۲۸ سرویس تخصصی</p>
            </div>
          </Link>

          {/* ناوبری */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
            >
              <Home className="h-4 w-4" />
              <span>خانه</span>
            </Link>
            <Link 
              href="/nlp" 
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
            >
              <Database className="h-4 w-4" />
              <span>پروژه‌ها</span>
            </Link>
            <Link 
              href="/services" 
              className="flex items-center gap-2 text-purple-600 font-semibold"
            >
              <Cpu className="h-4 w-4" />
              <span>سرویس‌ها</span>
            </Link>
            <Link 
              href="/security" 
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
            >
              <Shield className="h-4 w-4" />
              <span>امنیت</span>
            </Link>
            <Link 
              href="/performance" 
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
            >
              <Zap className="h-4 w-4" />
              <span>کارایی</span>
            </Link>
          </nav>

          {/* دکمه‌های عملیاتی */}
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition"
            >
              پنل مدیریت
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center border border-purple-200">
              <span className="font-bold text-purple-700">👨‍💻</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ServicesHeader;
