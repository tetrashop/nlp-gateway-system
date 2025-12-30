'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import ServiceStatus from '../dashboard/service-status';

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
        
        {/* Service Status Bar */}
        <ServiceStatus />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>NLP Project Gateway v1.0 • مدیریت ۲۸ سرویس • {new Date().getFullYear()} ©</p>
          <p className="text-xs mt-1">
            <span className="gateway-badge">Gateway Active</span>
            • آخرین به‌روزرسانی: امروز {new Date().toLocaleTimeString('fa-IR')}
          </p>
        </footer>
      </div>
    </div>
  );
}
