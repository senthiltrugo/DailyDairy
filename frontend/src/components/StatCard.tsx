"use client";

import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass,
  iconBgClass,
}: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          ) : null}
        </div>
        <div className={`rounded-xl p-2.5 ${iconBgClass}`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColorClass}`} />
        </div>
      </div>
    </div>
  );
};
