'use client';

export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="skeleton h-8 w-64 mb-2"></div>
            <div className="skeleton h-4 w-48"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
            <div className="flex items-center gap-3">
              <div className="skeleton w-10 h-10 rounded-full"></div>
              <div>
                <div className="skeleton h-3 w-20 mb-1"></div>
                <div className="skeleton h-6 w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-base-200 rounded-xl p-5 border-l-4 skeleton border-l-base-300">
            <div className="flex items-start gap-4">
              <div className="skeleton w-10 h-10 rounded-full"></div>
              <div className="flex-1">
                <div className="skeleton h-4 w-3/4 mb-2"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
