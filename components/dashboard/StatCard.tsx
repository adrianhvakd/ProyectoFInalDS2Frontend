interface StatCardProps {
  title: string;
  value: string | number;
  desc: string;
  colorClass: string;
  bgClass?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, desc, colorClass, bgClass = "", icon }: StatCardProps) => {
  return (
    <div className={`stats shadow bg-base-200 border border-neutral-content/10 ${bgClass}`}>
      <div className="stat">
        <div className="stat-title text-base-content/60 flex items-center gap-2">
          {icon}
          {title}
        </div>
        <div className={`stat-value ${colorClass}`}>{value}</div>
        <div className="stat-desc text-base-content/50">{desc}</div>
      </div>
    </div>
  );
};