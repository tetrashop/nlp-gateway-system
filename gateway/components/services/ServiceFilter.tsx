'use client';

import React from 'react';

interface ServiceFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
        فیلتر دسته‌بندی
      </h3>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`w-full text-right p-3 rounded-lg transition-colors ${
            selectedCategory === category
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ServiceFilter;
