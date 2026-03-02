export const ChartSkeleton = () => (
  <div className="w-full h-80 flex items-center justify-center bg-base-200 rounded-2xl border border-neutral-content/10">
    <span className="loading loading-dots loading-md text-primary"></span>
  </div>
);

export const ChartError = ({ message }: { message: string }) => (
  <div className="w-full h-80 flex items-center justify-center bg-base-200 rounded-2xl border border-neutral-content/10 text-red-500 p-4 text-center">
    {message}
  </div>
);