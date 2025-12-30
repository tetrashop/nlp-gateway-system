import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "جستجو در پروژه‌ها..." 
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 inset-y-0 flex items-center text-white/70 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
