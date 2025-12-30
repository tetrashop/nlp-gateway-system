import React from 'react';
import Link from 'next/link';
import { NLPProject } from '@/app/nlpData';

interface NLPProjectCardProps {
  project: NLPProject;
}

const NLPProjectCard: React.FC<NLPProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* هدر کارت */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full">
            #{project.id.toString().padStart(3, '0')}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          {project.apiKeyRequired ? (
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
              API فعال
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-full">
              در حال توسعه
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {project.title}
          </h3>
        </div>
      </div>

      {/* بدنه کارت */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{project.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({Math.floor(Math.random() * 1000)})</span>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {project.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* نوار پیشرفت */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>پیشرفت پروژه</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* تگ‌ها */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* فوتر کارت */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
              {project.author.charAt(0)}
            </div>
            <span className="text-sm text-gray-600">{project.author}</span>
          </div>
          
          <Link 
            href={`/nlp/${project.id}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NLPProjectCard;
