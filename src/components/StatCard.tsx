import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 text-xs text-white/70">{label}</div>
      <div className="flex items-center gap-2 text-2xl font-bold">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
