export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* اسکلت هدر */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          {/* اسکلت دکمه */}
          <div className="h-12 bg-gray-200 rounded w-64 mb-12"></div>

          {/* اسکلت کارت‌ها */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>

          {/* اسکلت محتوا */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
