import React from 'react';
import Link from 'next/link';
import { Brain, Home, BookOpen, FileCode, Users } from 'lucide-react';

const NLPHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* لوگو */}
          <Link href="/nlp" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tetrashop NLP
              </h1>
              <p className="text-xs text-gray-500">پروژه‌های هوش مصنوعی</p>
            </div>
          </Link>

          {/* ناوبری */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <Home className="h-4 w-4" />
              <span>خانه</span>
            </Link>
            <Link 
              href="/nlp" 
              className="flex items-center gap-2 text-blue-600 font-semibold"
            >
              <Brain className="h-4 w-4" />
              <span>پروژه‌ها</span>
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>مستندات</span>
            </Link>
            <Link 
              href="/api" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <FileCode className="h-4 w-4" />
              <span>API</span>
            </Link>
            <Link 
              href="/team" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <Users className="h-4 w-4" />
              <span>تیم</span>
            </Link>
          </nav>

          {/* دکمه‌های عملیاتی */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition">
              درخواست API رایگان
            </button>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-700">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NLPHeader;
