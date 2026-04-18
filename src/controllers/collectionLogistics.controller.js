const prisma = require("../config/prisma");
const { calculateDistanceKm } = require("../utils/calculateDistanceKm");

const mapCenterResponse = (center) => ({
  id: center.id,
  name: center.name,
  location: center.location,
  capacity_litres: Number(center.capacityLitres),
  manager_name: center.managerName,
  latitude: center.latitude !== null ? Number(center.latitude) : null,
  longitude: center.longitude !== null ? Number(center.longitude) : null,
  created_at: center.createdAt,
});

const mapCollectionRecordResponse = (record) => ({
  id: record.id,
  farmer_id: record.farmerId,
  center_id: record.centerId,
  quantity: Number(record.quantity),
  timestamp: record.timestamp,
});

const getDayBounds = (inputDate) => {
  const start = inputDate ? new Date(inputDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const createCollectionCenter = async (req, res, next) => {
  try {
    const { name, location, capacity_litres: capacityLitres, manager_name: managerName, latitude, longitude } =
      req.body;

    const errors = [];
    if (!name) errors.push("name is required");
    if (!location) errors.push("location is required");
    if (capacityLitres === undefined) errors.push("capacity_litres is required");
    if (!managerName) errors.push("manager_name is required");
    if (capacityLitres !== undefined && (!Number.isFinite(Number(capacityLitres)) || Number(capacityLitres) <= 0)) {
      errors.push("capacity_litres must be greater than 0");
    }
    if (
      latitude !== undefined &&
      latitude !== null &&
      (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)
    ) {
      errors.push("latitude must be between -90 and 90");
    }
    if (
      longitude !== undefined &&
      longitude !== null &&
      (!Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)
    ) {
      errors.push("longitude must be between -180 and 180");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const center = await prisma.collectionCenter.create({
      data: {
        name,
        location,
        capacityLitres: Number(capacityLitres),
        managerName,
        ...(latitude !== undefined && latitude !== null && { latitude: Number(latitude) }),
        ...(longitude !== undefined && longitude !== null && { longitude: Number(longitude) }),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Collection center created successfully",
      data: mapCenterResponse(center),
    });
  } catch (error) {
    next(error);
  }
};

const getCollectionCenters = async (_req, res, next) => {
  try {
    const centers = await prisma.collectionCenter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: centers.map(mapCenterResponse),
    });
  } catch (error) {
    next(error);
  }
};

const resolveCenterForFarmer = async (farmer, requestedCenterId) => {
  if (requestedCenterId) {
    const requestedCenter = await prisma.collectionCenter.findUnique({
      where: { id: requestedCenterId },
    });
    return requestedCenter || null;
  }

  const existingAssignment = await prisma.farmerCollectionCenter.findUnique({
    where: { farmerId: farmer.id },
    include: { center: true },
  });
  if (existingAssignment?.center) {
    return existingAssignment.center;
  }

  const centers = await prisma.collectionCenter.findMany();
  if (centers.length === 0) return null;

  if (farmer.latitude === null || farmer.longitude === null) {
    return centers[0];
  }

  let nearestCenter = centers[0];
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const center of centers) {
    if (center.latitude === null || center.longitude === null) {
      continue;
    }
    const distance = calculateDistanceKm(
      Number(farmer.latitude),
      Number(farmer.longitude),
      Number(center.latitude),
      Number(center.longitude),
    );
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCenter = center;
    }
  }

  return nearestCenter;
};

const createCollectionRecord = async (req, res, next) => {
  try {
    const {
      farmer_id: farmerId,
      center_id: requestedCenterId,
      quantity,
      timestamp,
    } = req.body;

    const errors = [];
    if (!farmerId) errors.push("farmer_id is required");
    if (quantity === undefined) errors.push("quantity is required");
    if (quantity !== undefined && (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0)) {
      errors.push("quantity must be greater than 0");
    }
    if (timestamp !== undefined && Number.isNaN(new Date(timestamp).getTime())) {
      errors.push("timestamp must be a valid datetime");
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
      select: { id: true, latitude: true, longitude: true },
    });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const center = await resolveCenterForFarmer(farmer, requestedCenterId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: "No collection center available for assignment",
      });
    }

    const recordTimestamp = timestamp ? new Date(timestamp) : new Date();

    const [record, aggregate] = await prisma.$transaction(async (tx) => {
      const created = await tx.collectionRecord.create({
        data: {
          farmerId,
          centerId: center.id,
          quantity: Number(quantity),
          timestamp: recordTimestamp,
        },
      });

      const distanceKm =
        farmer.latitude !== null &&
        farmer.longitude !== null &&
        center.latitude !== null &&
        center.longitude !== null
          ? calculateDistanceKm(
              Number(farmer.latitude),
              Number(farmer.longitude),
              Number(center.latitude),
              Number(center.longitude),
            )
          : null;

      await tx.farmerCollectionCenter.upsert({
        where: { farmerId },
        create: {
          farmerId,
          centerId: center.id,
          distanceKm: distanceKm !== null ? distanceKm : undefined,
        },
        update: {
          centerId: center.id,
          distanceKm: distanceKm !== null ? distanceKm : null,
          assignedAt: new Date(),
        },
      });

      const { start, end } = getDayBounds(recordTimestamp);
      const grouped = await tx.collectionRecord.aggregate({
        where: {
          centerId: center.id,
          timestamp: {
            gte: start,
            lt: end,
          },
        },
        _sum: { quantity: true },
      });

      return [created, grouped];
    });

    const dailyTotal = Number(aggregate._sum.quantity || 0);
    const capacity = Number(center.capacityLitres);
    const capacityExceeded = dailyTotal > capacity;

    return res.status(201).json({
      success: true,
      message: "Milk collected successfully",
      data: {
        ...mapCollectionRecordResponse(record),
        assigned_center: {
          id: center.id,
          name: center.name,
          location: center.location,
        },
      },
      daily_capacity_status: {
        center_id: center.id,
        date: recordTimestamp.toISOString().slice(0, 10),
        daily_total_quantity: Number(dailyTotal.toFixed(2)),
        capacity_litres: capacity,
        alert: capacityExceeded ? "CAPACITY_EXCEEDED" : "OK",
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDailyCollectionSummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (date && Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["date must be a valid date"],
      });
    }

    const { start, end } = getDayBounds(date);

    const centers = await prisma.collectionCenter.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        records: {
          where: {
            timestamp: {
              gte: start,
              lt: end,
            },
          },
          select: { quantity: true },
        },
      },
    });

    const summary = centers.map((center) => {
      const dailyTotal = center.records.reduce((sum, record) => sum + Number(record.quantity), 0);
      const capacity = Number(center.capacityLitres);
      return {
        center_id: center.id,
        center_name: center.name,
        location: center.location,
        date: start.toISOString().slice(0, 10),
        daily_total_quantity: Number(dailyTotal.toFixed(2)),
        capacity_litres: capacity,
        alert: dailyTotal > capacity ? "CAPACITY_EXCEEDED" : "OK",
      };
    });

    return res.json({
      success: true,
      data: summary,
      aggregation_query: {
        type: "prisma",
        description: "Daily total quantity collected per center",
        pseudo_sql:
          "SELECT center_id, DATE(timestamp) AS date, SUM(quantity) AS daily_total FROM collection_records WHERE timestamp >= :start AND timestamp < :end GROUP BY center_id, DATE(timestamp)",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCollectionCenter,
  getCollectionCenters,
  createCollectionRecord,
  getDailyCollectionSummary,
};
