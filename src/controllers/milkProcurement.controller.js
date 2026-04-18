const prisma = require("../config/prisma");
const { calculateTotalAmount } = require("../utils/calculateTotalAmount");

const mapMilkEntryResponse = (entry) => ({
  id: entry.id,
  farmer_id: entry.farmerId,
  date: entry.date,
  quantity_litres: Number(entry.quantityLitres),
  fat_percentage: Number(entry.fatPercentage),
  snf_percentage: Number(entry.snfPercentage),
  price_per_litre: Number(entry.pricePerLitre),
  total_amount: Number(entry.totalAmount),
});

const createMilkEntry = async (req, res, next) => {
  try {
    const {
      farmer_id: farmerId,
      date,
      quantity_litres: quantityLitres,
      fat_percentage: fatPercentage,
      snf_percentage: snfPercentage,
      price_per_litre: pricePerLitre,
    } = req.body;

    const errors = [];

    if (!farmerId) errors.push("farmer_id is required");
    if (!date) errors.push("date is required");
    if (quantityLitres === undefined) {
      errors.push("quantity_litres is required");
    } else if (!Number.isFinite(Number(quantityLitres))) {
      errors.push("quantity_litres must be a valid number");
    } else if (Number(quantityLitres) <= 0) {
      errors.push("quantity_litres must be greater than 0");
    }
    if (fatPercentage === undefined || fatPercentage === null || fatPercentage === "") {
      errors.push("fat_percentage is required");
    }
    if (snfPercentage === undefined) errors.push("snf_percentage is required");
    if (pricePerLitre === undefined) errors.push("price_per_litre is required");
    if (pricePerLitre !== undefined && !Number.isFinite(Number(pricePerLitre))) {
      errors.push("price_per_litre must be a valid number");
    }
    if (snfPercentage !== undefined && !Number.isFinite(Number(snfPercentage))) {
      errors.push("snf_percentage must be a valid number");
    }
    if (
      fatPercentage !== undefined &&
      fatPercentage !== null &&
      fatPercentage !== "" &&
      !Number.isFinite(Number(fatPercentage))
    ) {
      errors.push("fat_percentage must be a valid number");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
      select: { id: true },
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const totalAmount = calculateTotalAmount(quantityLitres, pricePerLitre, fatPercentage);
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["date must be a valid date"],
      });
    }

    const milkEntry = await prisma.milkProcurementRecord.create({
      data: {
        farmerId,
        date: parsedDate,
        quantityLitres: Number(quantityLitres),
        fatPercentage: Number(fatPercentage),
        snfPercentage: Number(snfPercentage),
        pricePerLitre: Number(pricePerLitre),
        totalAmount,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Milk entry created successfully",
      data: mapMilkEntryResponse(milkEntry),
    });
  } catch (error) {
    next(error);
  }
};

const getMilkEntries = async (req, res, next) => {
  try {
    const { farmer_id: farmerId, date } = req.query;

    const where = {};

    if (farmerId) {
      where.farmerId = farmerId;
    }

    if (date) {
      const startOfDay = new Date(date);
      if (Number.isNaN(startOfDay.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["date must be a valid date"],
        });
      }

      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);

      where.date = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    const milkEntries = await prisma.milkProcurementRecord.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return res.json({
      success: true,
      data: milkEntries.map(mapMilkEntryResponse),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMilkEntry,
  getMilkEntries,
};
