const CATEGORY_ROI_RATES = {
  milk: 0.15,
  hub: 0.22,
  "value-added": 0.3,
};

const CATEGORY_LABELS = {
  milk: "milk",
  hub: "hubs",
  "value-added": "value-added",
};

const safePercent = (part, total) => {
  if (!total || total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
};

const calculatePortfolio = (investments) => {
  const totalsByCategory = {
    milk: 0,
    hub: 0,
    "value-added": 0,
  };

  for (const investment of investments) {
    const category = String(investment.category || "").toLowerCase();
    if (Object.hasOwn(CATEGORY_ROI_RATES, category)) {
      totalsByCategory[category] += Number(investment.amount);
    }
  }

  const totalInvestment = Number(
    Object.values(totalsByCategory)
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  );

  const allocationPercentages = {
    milk: safePercent(totalsByCategory.milk, totalInvestment),
    hubs: safePercent(totalsByCategory.hub, totalInvestment),
    "value-added": safePercent(totalsByCategory["value-added"], totalInvestment),
  };

  const returnsByCategory = {
    milk: Number((totalsByCategory.milk * CATEGORY_ROI_RATES.milk).toFixed(2)),
    hubs: Number((totalsByCategory.hub * CATEGORY_ROI_RATES.hub).toFixed(2)),
    "value-added": Number(
      (totalsByCategory["value-added"] * CATEGORY_ROI_RATES["value-added"]).toFixed(2),
    ),
  };

  const totalExpectedReturns = Number(
    Object.values(returnsByCategory)
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  );

  const totalROI = totalInvestment > 0 ? Number(((totalExpectedReturns / totalInvestment) * 100).toFixed(2)) : 0;

  return {
    total_invested_amount: totalInvestment,
    allocation_percentages: allocationPercentages,
    category_amounts: {
      milk: Number(totalsByCategory.milk.toFixed(2)),
      hubs: Number(totalsByCategory.hub.toFixed(2)),
      "value-added": Number(totalsByCategory["value-added"].toFixed(2)),
    },
    roi_rates: {
      milk: "15%",
      hubs: "22%",
      "value-added": "30%",
    },
    expected_returns_by_category: returnsByCategory,
    total_expected_returns: totalExpectedReturns,
    total_roi_percentage: totalROI,
    breakdown: Object.keys(CATEGORY_ROI_RATES).map((key) => ({
      category: CATEGORY_LABELS[key],
      invested_amount: Number(totalsByCategory[key].toFixed(2)),
      allocation_percentage: allocationPercentages[CATEGORY_LABELS[key]],
      roi_rate_percentage: Number((CATEGORY_ROI_RATES[key] * 100).toFixed(2)),
      expected_return: Number((totalsByCategory[key] * CATEGORY_ROI_RATES[key]).toFixed(2)),
    })),
  };
};

module.exports = {
  calculatePortfolio,
  CATEGORY_ROI_RATES,
};
