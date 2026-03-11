'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <header>
          <div className="skeleton h-8 w-32 mb-2"></div>
          <div className="skeleton h-4 w-64"></div>
        </header>

        <div className="skeleton h-16 w-full rounded-lg"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="skeleton h-3 w-24 mb-1"></div>
                    <div className="skeleton h-8 w-12"></div>
                  </div>
                  <div className="skeleton w-12 h-12 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="skeleton h-80 w-full rounded-lg"></div>
      </main>
    </div>
  );
}
