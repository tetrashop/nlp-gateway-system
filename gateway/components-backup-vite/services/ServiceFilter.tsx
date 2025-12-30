import React from 'react';
import { Filter, X } from 'lucide-react';

interface ServiceFilterProps {
  selectedCategory: string;
  selectedPricing: string;
  onCategoryChange: (category: string) => void;
  onPricingChange: (pricing: string) => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({
  selectedCategory,
  selectedPricing,
  onCategoryChange,
  onPricingChange,
}) => {
  const categories = [
    { value: 'all', label: 'همه دسته‌ها' },
    { value: 'api', label: 'API سرویس‌ها' },
    { value: 'tool', label: 'ابزارها' },
    { value: 'library', label: 'کتابخانه‌ها' },
    { value: 'platform', label: 'پلتفرم‌ها' },
  ];

  const pricingOptions = [
    { value: 'all', label: 'همه قیمت‌ها' },
    { value: 'free', label: 'رایگان' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid', label: 'پولی' },
    { value: 'enterprise', label: 'سازمانی' },
  ];

  const clearFilters = () => {
    onCategoryChange('all');
    onPricingChange('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPricing !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">فیلتر سرویس‌ها</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-4 w-4" />
            پاک کردن فیلترها
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* فیلتر دسته‌بندی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            دسته‌بندی سرویس
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* فیلتر قیمت‌گذاری */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            مدل قیمت‌گذاری
          </label>
          <div className="flex flex-wrap gap-2">
            {pricingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPricingChange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedPricing === option.value
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* نمایش فیلترهای فعال */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">فیلترهای فعال:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full">
                دسته: {categories.find(c => c.value === selectedCategory)?.label}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedPricing !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full">
                قیمت: {pricingOptions.find(p => p.value === selectedPricing)?.label}
                <button
                  onClick={() => onPricingChange('all')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* آمار فیلتر */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">تعداد سرویس‌ها:</span>
            <span className="text-blue-600 font-bold">28</span>
          </div>
          <div>
            {selectedCategory === 'all' && selectedPricing === 'all' ? (
              <span className="text-green-600 font-medium">همه سرویس‌ها نمایش داده می‌شوند</span>
            ) : (
              <span className="text-blue-600 font-medium">سرویس‌های فیلترشده نمایش داده می‌شوند</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
