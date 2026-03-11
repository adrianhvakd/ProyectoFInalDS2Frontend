'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content p-6 lg:p-8">
      <main className="max-w-6xl mx-auto space-y-8">
        <header>
          <div className="skeleton h-8 w-48 mb-2"></div>
          <div className="skeleton h-4 w-64"></div>
        </header>
        
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="skeleton h-6 w-32 mb-2"></div>
                <div className="skeleton h-4 w-48"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <div className="skeleton w-8 h-8 rounded"></div>
                  <div>
                    <div className="skeleton h-3 w-16 mb-1"></div>
                    <div className="skeleton h-5 w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-lg border border-base-300 bg-base-100">
                  <div className="skeleton h-5 w-24 mb-2"></div>
                  <div className="skeleton h-8 w-16 mb-3"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
