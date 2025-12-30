'use client';

import React from 'react';

interface NLPProjectCardProps {
  title: string;
  description: string;
  category?: string;
  onClick?: () => void;
}

const NLPProjectCard: React.FC<NLPProjectCardProps> = ({ 
  title, 
  description, 
  category,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
    >
      <div className="p-6">
        {category && (
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 text-xs rounded-full mb-3">
            {category}
          </span>
        )}
        
        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            مشاهده جزئیات →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NLPProjectCard;
