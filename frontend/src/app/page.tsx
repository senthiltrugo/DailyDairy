"use client";

import { useMemo, useState } from "react";
import {
  ChartLine,
  CircleDollarSign,
  Droplets,
  Loader2,
  Tractor,
  Wallet,
} from "lucide-react";
import { PortfolioCard } from "@/components/PortfolioCard";
import { RecentTransactions } from "@/components/RecentTransactions";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { InvestorDashboardResponse } from "@/types/dashboard";

const DEFAULT_INVESTOR_ID = "ee860395-15b8-40c9-886e-f3cb48d2f705";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const useInvestorDashboard = (investorId: string) => {
  const [data, setData] = useState<InvestorDashboardResponse["data"] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/investor-dashboard/${investorId}`,
        {
          cache: "no-store",
        },
      );
      const payload = (await response.json()) as
        | InvestorDashboardResponse
        | { message?: string };

      if (!response.ok || !("success" in payload) || !payload.success) {
        setError(
          ("message" in payload && payload.message) ||
            "Failed to load investor dashboard data.",
        );
        setData(null);
        return;
      }

      setData(payload.data);
    } catch (_error) {
      setError("Unable to reach API. Check backend server.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchDashboard,
  };
};

export default function Home() {
  const [investorId, setInvestorId] = useState(DEFAULT_INVESTOR_ID);
  const { data, isLoading, error, fetchDashboard } =
    useInvestorDashboard(investorId);

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Total Investment",
        value: formatCurrency(data.summary_cards.total_investment),
        subtitle: `ROI ${formatNumber(data.summary_cards.roi_percentage, 2)}%`,
        icon: Wallet,
        iconColorClass: "text-emerald-600",
        iconBgClass: "bg-emerald-50",
      },
      {
        title: "Current Returns",
        value: formatCurrency(data.summary_cards.current_returns),
        subtitle: "Expected returns",
        icon: ChartLine,
        iconColorClass: "text-indigo-600",
        iconBgClass: "bg-indigo-50",
      },
      {
        title: "Total Cows Funded",
        value: formatNumber(data.summary_cards.total_cows_funded, 0),
        subtitle: "Estimated funded livestock",
        icon: CircleDollarSign,
        iconColorClass: "text-amber-600",
        iconBgClass: "bg-amber-50",
      },
      {
        title: "Active Farms/Hubs",
        value: formatNumber(data.summary_cards.active_farms_hubs, 0),
        subtitle: "Operational units",
        icon: Tractor,
        iconColorClass: "text-sky-600",
        iconBgClass: "bg-sky-50",
      },
      {
        title: "Daily Milk Production",
        value: `${formatNumber(data.summary_cards.daily_milk_production_litres)} L`,
        subtitle: "Projected daily output",
        icon: Droplets,
        iconColorClass: "text-cyan-600",
        iconBgClass: "bg-cyan-50",
      },
    ];
  }, [data]);

  const investorName = data?.investor.name ?? "Investor";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Investor Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Portfolio Insights
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Mobile-first, fintech-style portfolio tracking for dairy
                investments.
              </p>
              {data ? (
                <p className="mt-2 text-sm font-medium text-slate-700">
                  Welcome back, {investorName}
                </p>
              ) : null}
            </div>
            <form
              className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[360px]"
              onSubmit={(event) => {
                event.preventDefault();
                fetchDashboard();
              }}
            >
              <label
                htmlFor="investor-id"
                className="text-xs font-medium text-slate-500"
              >
                Investor ID
              </label>
              <div className="flex gap-2">
                <input
                  id="investor-id"
                  value={investorId}
                  onChange={(event) => setInvestorId(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2"
                  placeholder="Enter investor UUID"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load"
                  )}
                </button>
              </div>
            </form>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </header>

        {!data && !isLoading && !error ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Enter an investor ID and tap Load to view dashboard.
          </section>
        ) : null}

        {isLoading ? (
          <section className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </section>
        ) : null}

        {data ? (
          <div className="space-y-5">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.slice(0, 2).map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.slice(2).map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
              <PortfolioCard breakdown={data.portfolio_breakdown} />
              <RecentTransactions transactions={data.recent_transactions} />
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
