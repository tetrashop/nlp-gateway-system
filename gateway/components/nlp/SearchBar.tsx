'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value = '', 
  onChange, 
  placeholder = 'جستجو...',
  onSearch 
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(internalValue);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={onChange ? value : internalValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full p-3 pr-10 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        dir="rtl"
      />
      <button
        onClick={handleSearchClick}
        className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
