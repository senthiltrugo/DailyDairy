export type InvestorDashboardResponse = {
  success: boolean;
  data: {
    investor: {
      id: string;
      name: string;
      phone: string;
      email: string;
      KYC_status: "PENDING" | "VERIFIED" | "REJECTED";
      created_at: string;
    };
    summary_cards: {
      total_cows_funded: number;
      active_farms_hubs: number;
      daily_milk_production_litres: number;
      total_investment: number;
      current_returns: number;
      roi_percentage: number;
    };
    portfolio_breakdown: {
      allocation_percentages: {
        milk: number;
        hubs: number;
        "value-added": number;
      };
      category_amounts: {
        milk: number;
        hubs: number;
        "value-added": number;
      };
      expected_returns_by_category: {
        milk: number;
        hubs: number;
        "value-added": number;
      };
      roi_rates: {
        milk: string;
        hubs: string;
        "value-added": string;
      };
      pie_chart_data: Array<{
        name: string;
        value: number;
        amount: number;
      }>;
    };
    recent_transactions: Array<{
      id: string;
      category: "milk" | "hub" | "value-added";
      amount: number;
      date: string;
    }>;
  };
};

