const prisma = require("../config/prisma");
const { computeOutputs } = require("../utils/conversionEngine");

const mapManufacturerResponse = (manufacturer) => ({
  id: manufacturer.id,
  name: manufacturer.name,
  location: manufacturer.location,
  capacity_per_day: Number(manufacturer.capacityPerDay),
  supported_products: manufacturer.supportedProducts,
  created_at: manufacturer.createdAt,
});

const mapDispatchResponse = (dispatch) => ({
  id: dispatch.id,
  center_id: dispatch.centerId,
  manufacturer_id: dispatch.manufacturerId,
  quantity: Number(dispatch.quantity),
  date: dispatch.date,
  paneer_output_kg: Number(dispatch.paneerOutputKg),
  ghee_output_kg: Number(dispatch.gheeOutputKg),
});

const getDayBounds = (inputDate) => {
  const start = inputDate ? new Date(inputDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const createManufacturer = async (req, res, next) => {
  try {
    const {
      name,
      location,
      capacity_per_day: capacityPerDay,
      supported_products: supportedProducts,
    } = req.body;

    const errors = [];
    if (!name) errors.push("name is required");
    if (!location) errors.push("location is required");
    if (capacityPerDay === undefined) errors.push("capacity_per_day is required");
    if (
      capacityPerDay !== undefined &&
      (!Number.isFinite(Number(capacityPerDay)) || Number(capacityPerDay) <= 0)
    ) {
      errors.push("capacity_per_day must be greater than 0");
    }
    if (supportedProducts === undefined) {
      errors.push("supported_products is required");
    } else if (
      !Array.isArray(supportedProducts) &&
      (typeof supportedProducts !== "object" || supportedProducts === null)
    ) {
      errors.push("supported_products must be an array or JSON object");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const manufacturer = await prisma.manufacturer.create({
      data: {
        name,
        location,
        capacityPerDay: Number(capacityPerDay),
        supportedProducts,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Manufacturer created successfully",
      data: mapManufacturerResponse(manufacturer),
    });
  } catch (error) {
    next(error);
  }
};

const createMilkDispatch = async (req, res, next) => {
  try {
    const {
      center_id: centerId,
      manufacturer_id: manufacturerId,
      quantity,
      date,
    } = req.body;

    const errors = [];
    if (!centerId) errors.push("center_id is required");
    if (!manufacturerId) errors.push("manufacturer_id is required");
    if (quantity === undefined) errors.push("quantity is required");
    if (quantity !== undefined && (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0)) {
      errors.push("quantity must be greater than 0");
    }
    if (!date) errors.push("date is required");
    if (date && Number.isNaN(new Date(date).getTime())) {
      errors.push("date must be a valid date");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const [center, manufacturer] = await Promise.all([
      prisma.collectionCenter.findUnique({ where: { id: centerId } }),
      prisma.manufacturer.findUnique({ where: { id: manufacturerId } }),
    ]);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Collection center not found",
      });
    }
    if (!manufacturer) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    const dispatchDate = new Date(date);
    const { start, end } = getDayBounds(dispatchDate);

    const existingDailyAgg = await prisma.milkDispatch.aggregate({
      where: {
        manufacturerId,
        date: {
          gte: start,
          lt: end,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const alreadyDispatched = Number(existingDailyAgg._sum.quantity || 0);
    const nextTotal = alreadyDispatched + Number(quantity);
    const capacityPerDay = Number(manufacturer.capacityPerDay);
    const capacityExceeded = nextTotal > capacityPerDay;

    const outputs = computeOutputs({
      inputMilkLitres: quantity,
      supportedProducts: manufacturer.supportedProducts,
    });

    const dispatch = await prisma.milkDispatch.create({
      data: {
        centerId,
        manufacturerId,
        quantity: Number(quantity),
        date: dispatchDate,
        paneerOutputKg: outputs.paneer_output_kg,
        gheeOutputKg: outputs.ghee_output_kg,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Milk dispatched successfully",
      data: {
        ...mapDispatchResponse(dispatch),
        conversion_output: outputs,
      },
      manufacturer_capacity_status: {
        manufacturer_id: manufacturer.id,
        date: start.toISOString().slice(0, 10),
        daily_input_milk_litres: Number(nextTotal.toFixed(2)),
        capacity_per_day: capacityPerDay,
        alert: capacityExceeded ? "CAPACITY_EXCEEDED" : "OK",
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProcessingReport = async (req, res, next) => {
  try {
    const { date, manufacturer_id: manufacturerId } = req.query;
    if (date && Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["date must be a valid date"],
      });
    }

    const { start, end } = getDayBounds(date);

    const where = {
      date: {
        gte: start,
        lt: end,
      },
      ...(manufacturerId && { manufacturerId }),
    };

    const dispatches = await prisma.milkDispatch.findMany({
      where,
      include: {
        manufacturer: true,
        center: true,
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    const groupedByManufacturer = new Map();

    for (const dispatch of dispatches) {
      const key = dispatch.manufacturerId;
      if (!groupedByManufacturer.has(key)) {
        groupedByManufacturer.set(key, {
          manufacturer_id: dispatch.manufacturerId,
          manufacturer_name: dispatch.manufacturer.name,
          location: dispatch.manufacturer.location,
          date: start.toISOString().slice(0, 10),
          input_milk_litres: 0,
          output_products: {
            paneer_kg: 0,
            ghee_kg: 0,
          },
          dispatches: [],
        });
      }

      const current = groupedByManufacturer.get(key);
      current.input_milk_litres += Number(dispatch.quantity);
      current.output_products.paneer_kg += Number(dispatch.paneerOutputKg);
      current.output_products.ghee_kg += Number(dispatch.gheeOutputKg);
      current.dispatches.push({
        dispatch_id: dispatch.id,
        center_id: dispatch.centerId,
        center_name: dispatch.center.name,
        quantity: Number(dispatch.quantity),
      });
    }

    const report = [...groupedByManufacturer.values()].map((item) => ({
      ...item,
      input_milk_litres: Number(item.input_milk_litres.toFixed(2)),
      output_products: {
        paneer_kg: Number(item.output_products.paneer_kg.toFixed(3)),
        ghee_kg: Number(item.output_products.ghee_kg.toFixed(3)),
      },
    }));

    return res.json({
      success: true,
      data: report,
      conversion_rules: {
        paneer: "10L milk -> 1kg paneer",
        ghee: "25L milk -> 1kg ghee",
      },
      aggregation_query: {
        type: "prisma",
        description: "Grouped daily input milk and output products by manufacturer",
        pseudo_sql:
          "SELECT manufacturer_id, DATE(date) AS day, SUM(quantity) AS input_litres, SUM(paneer_output_kg) AS paneer_kg, SUM(ghee_output_kg) AS ghee_kg FROM milk_dispatches WHERE date >= :start AND date < :end GROUP BY manufacturer_id, DATE(date)",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createManufacturer,
  createMilkDispatch,
  getProcessingReport,
};
