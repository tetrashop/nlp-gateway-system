export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse">
          {/* اسکلت هدر */}
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-12"></div>
          
          {/* اسکلت فیلترها */}
          <div className="h-48 bg-gray-200 rounded-2xl mb-8"></div>
          
          {/* اسکلت کارت‌های آماری */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          
          {/* اسکلت سرویس‌ها */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
