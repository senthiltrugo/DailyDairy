const prisma = require("../config/prisma");

const mapFarmerResponse = (farmer) => ({
  id: farmer.id,
  name: farmer.name,
  phone: farmer.phone,
  village: farmer.village,
  district: farmer.district,
  latitude: farmer.latitude !== null ? Number(farmer.latitude) : null,
  longitude: farmer.longitude !== null ? Number(farmer.longitude) : null,
  bank_account_number: farmer.bankAccountNumber,
  ifsc_code: farmer.ifscCode,
  number_of_cattle: farmer.numberOfCattle,
  avg_daily_milk_litres: Number(farmer.avgDailyMilkLitres),
  created_at: farmer.createdAt,
});

const createFarmer = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      village,
      district,
      latitude,
      longitude,
      bank_account_number: bankAccountNumber,
      ifsc_code: ifscCode,
      number_of_cattle: numberOfCattle,
      avg_daily_milk_litres: avgDailyMilkLitres,
    } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!village) missingFields.push("village");
    if (!district) missingFields.push("district");
    if (!bankAccountNumber) missingFields.push("bank_account_number");
    if (!ifscCode) missingFields.push("ifsc_code");
    if (numberOfCattle === undefined) missingFields.push("number_of_cattle");
    if (avgDailyMilkLitres === undefined) missingFields.push("avg_daily_milk_litres");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: missingFields.map((field) => `${field} is required`),
      });
    }

    if (!Number.isFinite(Number(numberOfCattle)) || Number(numberOfCattle) < 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["number_of_cattle must be a non-negative number"],
      });
    }

    if (!Number.isFinite(Number(avgDailyMilkLitres)) || Number(avgDailyMilkLitres) < 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["avg_daily_milk_litres must be a non-negative number"],
      });
    }

    if (
      latitude !== undefined &&
      latitude !== null &&
      (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["latitude must be between -90 and 90"],
      });
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      (!Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["longitude must be between -180 and 180"],
      });
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        phone,
        village,
        district,
        ...(latitude !== undefined && latitude !== null && { latitude: Number(latitude) }),
        ...(longitude !== undefined && longitude !== null && { longitude: Number(longitude) }),
        bankAccountNumber,
        ifscCode,
        numberOfCattle: Number(numberOfCattle),
        avgDailyMilkLitres: Number(avgDailyMilkLitres),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Farmer created successfully",
      data: mapFarmerResponse(farmer),
    });
  } catch (error) {
    next(error);
  }
};

const getFarmers = async (_req, res, next) => {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: farmers.map(mapFarmerResponse),
    });
  } catch (error) {
    next(error);
  }
};

const updateFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      village,
      district,
      latitude,
      longitude,
      bank_account_number: bankAccountNumber,
      ifsc_code: ifscCode,
      number_of_cattle: numberOfCattle,
      avg_daily_milk_litres: avgDailyMilkLitres,
    } = req.body;

    const existingFarmer = await prisma.farmer.findUnique({ where: { id } });
    if (!existingFarmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    if (numberOfCattle !== undefined) {
      if (!Number.isFinite(Number(numberOfCattle)) || Number(numberOfCattle) < 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["number_of_cattle must be a non-negative number"],
        });
      }
    }

    if (avgDailyMilkLitres !== undefined) {
      if (!Number.isFinite(Number(avgDailyMilkLitres)) || Number(avgDailyMilkLitres) < 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["avg_daily_milk_litres must be a non-negative number"],
        });
      }
    }

    if (latitude !== undefined && latitude !== null) {
      if (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["latitude must be between -90 and 90"],
        });
      }
    }

    if (longitude !== undefined && longitude !== null) {
      if (
        !Number.isFinite(Number(longitude)) ||
        Number(longitude) < -180 ||
        Number(longitude) > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["longitude must be between -180 and 180"],
        });
      }
    }

    const farmer = await prisma.farmer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(village !== undefined && { village }),
        ...(district !== undefined && { district }),
        ...(latitude !== undefined && {
          latitude: latitude === null ? null : Number(latitude),
        }),
        ...(longitude !== undefined && {
          longitude: longitude === null ? null : Number(longitude),
        }),
        ...(bankAccountNumber !== undefined && { bankAccountNumber }),
        ...(ifscCode !== undefined && { ifscCode }),
        ...(numberOfCattle !== undefined && { numberOfCattle: Number(numberOfCattle) }),
        ...(avgDailyMilkLitres !== undefined && {
          avgDailyMilkLitres: Number(avgDailyMilkLitres),
        }),
      },
    });

    return res.json({
      success: true,
      message: "Farmer updated successfully",
      data: mapFarmerResponse(farmer),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFarmer,
  getFarmers,
  updateFarmer,
};
