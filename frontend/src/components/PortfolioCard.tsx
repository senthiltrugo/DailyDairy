"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { InvestorDashboardResponse } from "@/types/dashboard";

type PortfolioCardProps = {
  breakdown: InvestorDashboardResponse["data"]["portfolio_breakdown"];
};

const PIE_COLORS = ["#14b8a6", "#6366f1", "#f97316"];

type PieTooltipPayload = {
  name: string;
  value: number;
  payload: {
    amount: number;
  };
};

type PieTooltipProps = {
  active?: boolean;
  payload?: PieTooltipPayload[];
};

const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0] as PieTooltipPayload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{item.name}</p>
      <p className="text-slate-600">{formatNumber(item.value, 2)}% allocation</p>
      <p className="text-slate-600">{formatCurrency(item.payload.amount)}</p>
    </div>
  );
};

const progressConfig = [
  {
    key: "milk",
    label: "Milk (low risk)",
  },
  {
    key: "hubs",
    label: "Dairy hubs",
  },
  {
    key: "value-added",
    label: "Value-added products",
  },
] as const;

export const PortfolioCard = ({ breakdown }: PortfolioCardProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          Portfolio Breakdown
        </h2>
        <span className="text-xs text-slate-500">Risk diversified</span>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          {progressConfig.map((item, idx) => {
            const percent = breakdown.allocation_percentages[item.key] ?? 0;
            const amount = breakdown.category_amounts[item.key] ?? 0;
            const expected = breakdown.expected_returns_by_category[item.key] ?? 0;
            return (
              <div key={item.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(percent, 2)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(Math.max(percent, 0), 100)}%`,
                      backgroundColor: PIE_COLORS[idx],
                    }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatCurrency(amount)}</span>
                  <span>Expected: {formatCurrency(expected)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown.pie_chart_data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {breakdown.pie_chart_data.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
