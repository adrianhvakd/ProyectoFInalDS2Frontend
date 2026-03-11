'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 pt-20 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="skeleton h-10 w-64 mx-auto mb-4"></div>
          <div className="skeleton h-5 w-96 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-200/80 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-3">
                  <div className="skeleton h-8 w-8 rounded-lg"></div>
                  <div className="skeleton h-4 w-24"></div>
                </div>
                
                <div className="skeleton h-6 w-40 mb-2"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-4 w-3/4 mb-4"></div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="skeleton h-5 w-20 rounded"></div>
                  <div className="skeleton h-5 w-16 rounded"></div>
                  <div className="skeleton h-5 w-20 rounded"></div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                    <div className="skeleton h-4 w-4/5"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                    <div className="skeleton h-4 w-3/5"></div>
                  </div>
                </div>

                <div className="border-t border-base-300 pt-4 mt-auto">
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <div className="skeleton h-8 w-16"></div>
                    <div className="skeleton h-4 w-10"></div>
                  </div>
                  <div className="skeleton h-10 w-full rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
