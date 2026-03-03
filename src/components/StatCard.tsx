import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="card relative min-w-[220px] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4CFC7]">{label}</p>
      <div className="mt-3 flex items-end gap-3">
        {icon}
        <span className="font-shippori text-5xl leading-none text-[#FDFAF4]">{value}</span>
      </div>
    </div>
  );
}
