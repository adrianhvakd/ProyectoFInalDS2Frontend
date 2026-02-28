interface StatCardProps {
  title: string;
  value: string | number;
  desc: string;
  colorClass: string;
}

export const StatCard = ({ title, value, desc, colorClass }: StatCardProps) => {
  return (
    <div className="stats shadow bg-base-200 border border-neutral-content/10">
      <div className="stat">
        <div className="stat-title text-zinc-400">{title}</div>
        <div className={`stat-value ${colorClass}`}>{value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
};