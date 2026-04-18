"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { InvestorDashboardResponse } from "@/types/dashboard";

type RecentTransactionsProps = {
  transactions: InvestorDashboardResponse["data"]["recent_transactions"];
};

const CATEGORY_STYLE: Record<
  InvestorDashboardResponse["data"]["recent_transactions"][number]["category"],
  { label: string; chip: string; icon: typeof ArrowUpRight }
> = {
  milk: {
    label: "Milk",
    chip: "bg-teal-50 text-teal-700 border-teal-200",
    icon: ArrowUpRight,
  },
  hub: {
    label: "Dairy Hubs",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ArrowUpRight,
  },
  "value-added": {
    label: "Value-added",
    chip: "bg-orange-50 text-orange-700 border-orange-200",
    icon: ArrowDownRight,
  },
};

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          Recent Transactions
        </h2>
        <span className="text-xs text-slate-500">Latest activity</span>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            No recent investments found.
          </p>
        ) : (
          transactions.map((tx) => {
            const style = CATEGORY_STYLE[tx.category];
            const Icon = style.icon;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {style.label}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${style.chip}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tx.category}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
