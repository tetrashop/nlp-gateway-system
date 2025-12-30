'use client';

import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon = '🛠️',
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-5 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
