export const ChartSkeleton = () => (
  <div className="w-full h-80 flex items-center justify-center bg-base-200 rounded-2xl border border-slate-100">
    <span className="loading loading-dots loading-md text-primary"></span>
  </div>
);

export const ChartError = ({ message }: { message: string }) => (
  <div className="w-full h-80 flex items-center justify-center bg-base-200 rounded-2xl border border-red-100 text-red-500 p-4 text-center">
    {message}
  </div>
);