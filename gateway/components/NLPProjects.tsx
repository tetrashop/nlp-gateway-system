'use client';

import React from 'react';

const NLPProjects = () => {
  const projects = [
    { id: 1, name: 'پردازش متن فارسی', progress: 85, tasks: 12 },
    { id: 2, name: 'تشخیص موجودیت‌ها', progress: 65, tasks: 8 },
    { id: 3, name: 'خلاصه‌سازی خودکار', progress: 90, tasks: 5 },
    { id: 4, name: 'ترجمه ماشینی', progress: 75, tasks: 15 },
    { id: 5, name: 'تحلیل احساسات', progress: 95, tasks: 3 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">پروژه‌های NLP</h2>
      
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border-b dark:border-gray-700 pb-4 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">{project.name}</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">{project.tasks} کار</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                پیشرفت: {project.progress}%
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                جزئیات →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NLPProjects;
