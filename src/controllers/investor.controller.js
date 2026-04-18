const prisma = require("../config/prisma");

const ALLOWED_KYC_STATUSES = new Set(["PENDING", "VERIFIED", "REJECTED"]);
const ALLOWED_INVESTMENT_CATEGORIES = new Set(["milk", "hub", "value-added"]);

const mapInvestor = (investor) => ({
  id: investor.id,
  name: investor.name,
  phone: investor.phone,
  email: investor.email,
  KYC_status: investor.kycStatus,
  created_at: investor.createdAt,
});

const mapInvestment = (investment) => ({
  id: investment.id,
  investor_id: investment.investorId,
  amount: Number(investment.amount),
  category: investment.category,
  date: investment.date,
  created_at: investment.createdAt,
});

const createInvestor = async (req, res, next) => {
  try {
    const { name, phone, email, KYC_status: kycStatus } = req.body;

    const errors = [];
    if (!name) errors.push("name is required");
    if (!phone) errors.push("phone is required");
    if (!email) errors.push("email is required");
    if (!kycStatus) errors.push("KYC_status is required");

    const normalizedKyc = String(kycStatus || "").toUpperCase();
    if (kycStatus && !ALLOWED_KYC_STATUSES.has(normalizedKyc)) {
      errors.push("KYC_status must be one of: PENDING, VERIFIED, REJECTED");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const investor = await prisma.investor.create({
      data: {
        name,
        phone: String(phone),
        email: String(email).toLowerCase(),
        kycStatus: normalizedKyc,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Investor created successfully",
      data: mapInvestor(investor),
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Investor already exists with same phone or email",
      });
    }
    next(error);
  }
};

const createInvestment = async (req, res, next) => {
  try {
    const { investor_id: investorId, amount, category, date } = req.body;

    const errors = [];
    if (!investorId) errors.push("investor_id is required");
    if (amount === undefined) errors.push("amount is required");
    if (!category) errors.push("category is required");
    if (!date) errors.push("date is required");

    const parsedAmount = Number(amount);
    if (amount !== undefined && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)) {
      errors.push("amount must be greater than 0");
    }

    const normalizedCategory = String(category || "").toLowerCase();
    if (category && !ALLOWED_INVESTMENT_CATEGORIES.has(normalizedCategory)) {
      errors.push("category must be one of: milk, hub, value-added");
    }

    let parsedDate;
    if (date) {
      parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        errors.push("date must be a valid date");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
    });
    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    const investment = await prisma.investment.create({
      data: {
        investorId,
        amount: parsedAmount,
        category: normalizedCategory,
        date: parsedDate,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Investment recorded successfully",
      data: mapInvestment(investment),
    });
  } catch (error) {
    next(error);
  }
};

const getInvestorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const investor = await prisma.investor.findUnique({
      where: { id },
      include: {
        investments: {
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        },
      },
    });

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    const totalInvestmentAmount = investor.investments.reduce(
      (sum, entry) => sum + Number(entry.amount),
      0,
    );

    return res.json({
      success: true,
      data: {
        ...mapInvestor(investor),
        total_investments: investor.investments.length,
        total_investment_amount: Number(totalInvestmentAmount.toFixed(2)),
        investments: investor.investments.map(mapInvestment),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvestor,
  createInvestment,
  getInvestorById,
};
