'use client';

export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="skeleton h-8 w-64 mb-2"></div>
          <div className="skeleton h-4 w-32"></div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-10 w-32"></div>
        </div>
      </div>
      <div className="skeleton h-96 w-full rounded-lg"></div>
    </div>
  );
}
