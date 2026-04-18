const prisma = require("../config/prisma");
const { CATEGORY_ROI_RATES } = require("../utils/portfolioEngine");

const toStartOfMonth = (input) => {
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const toEndOfMonthExclusive = (startOfMonth) => {
  const date = new Date(startOfMonth);
  date.setMonth(date.getMonth() + 1);
  return date;
};

const getFarmerPayouts = async (req, res, next) => {
  try {
    const { date } = req.query;
    const startOfMonth = toStartOfMonth(date);
    if (!startOfMonth) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["date must be a valid date"],
      });
    }
    const endOfMonth = toEndOfMonthExclusive(startOfMonth);

    const entries = await prisma.milkProcurementRecord.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      include: {
        farmer: true,
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    const grouped = new Map();
    for (const entry of entries) {
      const key = entry.farmerId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          farmer_id: entry.farmerId,
          farmer_name: entry.farmer.name,
          phone: entry.farmer.phone,
          total_quantity_litres: 0,
          total_payout_amount: 0,
          entries_count: 0,
          entries: [],
        });
      }

      const current = grouped.get(key);
      const quantity = Number(entry.quantityLitres);
      const payout = Number(entry.totalAmount);
      current.total_quantity_litres += quantity;
      current.total_payout_amount += payout;
      current.entries_count += 1;
      current.entries.push({
        milk_entry_id: entry.id,
        date: entry.date,
        quantity_litres: quantity,
        total_amount: payout,
      });
    }

    const payouts = [...grouped.values()].map((item) => ({
      ...item,
      total_quantity_litres: Number(item.total_quantity_litres.toFixed(3)),
      total_payout_amount: Number(item.total_payout_amount.toFixed(2)),
    }));

    const grandTotalPayout = Number(
      payouts.reduce((sum, item) => sum + item.total_payout_amount, 0).toFixed(2),
    );

    return res.json({
      success: true,
      month: startOfMonth.toISOString().slice(0, 7),
      data: payouts,
      totals: {
        farmers_count: payouts.length,
        grand_total_payout_amount: grandTotalPayout,
      },
      payout_logic: "Farmer payout is based on milk entries total_amount in the selected month.",
    });
  } catch (error) {
    next(error);
  }
};

const getInvestorPayouts = async (req, res, next) => {
  try {
    const { date } = req.query;
    const startOfMonth = toStartOfMonth(date);
    if (!startOfMonth) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["date must be a valid date"],
      });
    }
    const endOfMonth = toEndOfMonthExclusive(startOfMonth);

    const investors = await prisma.investor.findMany({
      include: {
        investments: {
          where: {
            date: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const payouts = investors.map((investor) => {
      const categoryAmounts = {
        milk: 0,
        hub: 0,
        "value-added": 0,
      };

      for (const investment of investor.investments) {
        const category = String(investment.category || "").toLowerCase();
        if (Object.hasOwn(CATEGORY_ROI_RATES, category)) {
          categoryAmounts[category] += Number(investment.amount);
        }
      }

      const monthlyReturns = {
        milk: Number((categoryAmounts.milk * CATEGORY_ROI_RATES.milk).toFixed(2)),
        hubs: Number((categoryAmounts.hub * CATEGORY_ROI_RATES.hub).toFixed(2)),
        "value-added": Number(
          (categoryAmounts["value-added"] * CATEGORY_ROI_RATES["value-added"]).toFixed(2),
        ),
      };

      const totalInvestedAmount = Number(
        (categoryAmounts.milk + categoryAmounts.hub + categoryAmounts["value-added"]).toFixed(2),
      );
      const totalMonthlyReturn = Number(
        (monthlyReturns.milk + monthlyReturns.hubs + monthlyReturns["value-added"]).toFixed(2),
      );

      return {
        investor_id: investor.id,
        investor_name: investor.name,
        month: startOfMonth.toISOString().slice(0, 7),
        invested_amount: totalInvestedAmount,
        investments_count: investor.investments.length,
        monthly_returns_by_category: monthlyReturns,
        total_monthly_return: totalMonthlyReturn,
      };
    });

    const grandTotalMonthlyReturn = Number(
      payouts.reduce((sum, item) => sum + item.total_monthly_return, 0).toFixed(2),
    );

    return res.json({
      success: true,
      month: startOfMonth.toISOString().slice(0, 7),
      data: payouts,
      totals: {
        investors_count: payouts.length,
        grand_total_monthly_return: grandTotalMonthlyReturn,
      },
      payout_logic: {
        milk: "15% of monthly investment in milk category",
        hubs: "22% of monthly investment in hub category",
        "value-added": "30% of monthly investment in value-added category",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmerPayouts,
  getInvestorPayouts,
};
