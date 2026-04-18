const prisma = require("../config/prisma");

const ALLOWED_CUSTOMER_TYPES = new Set(["B2B", "D2C"]);

const toStartOfDay = (inputDate) => {
  const date = inputDate ? new Date(inputDate) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const parsePositive = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const sortInventoryForConsumption = (rows) =>
  [...rows].sort((a, b) => {
    const aExpiry = a.expiryDate ? new Date(a.expiryDate).getTime() : Number.POSITIVE_INFINITY;
    const bExpiry = b.expiryDate ? new Date(b.expiryDate).getTime() : Number.POSITIVE_INFINITY;
    if (aExpiry !== bExpiry) return aExpiry - bExpiry;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const mapCustomer = (customer) => ({
  id: customer.id,
  type: customer.type,
  name: customer.name,
  phone: customer.phone,
  address: customer.address,
});

const mapOrder = (order) => ({
  id: order.id,
  customer_id: order.customerId,
  product_id: order.productId,
  subscription_id: order.subscriptionId,
  quantity: Number(order.quantity),
  price: Number(order.price),
  total: Number(order.total),
  order_date: order.orderDate,
  source: order.source,
  customer: order.customer ? mapCustomer(order.customer) : undefined,
  product: order.product
    ? {
        id: order.product.id,
        name: order.product.name,
        unit: order.product.unit,
      }
    : undefined,
});

const mapSubscription = (subscription) => ({
  id: subscription.id,
  customer_id: subscription.customerId,
  product_id: subscription.productId,
  quantity_per_day: Number(subscription.quantityPerDay),
  start_date: subscription.startDate,
  is_active: subscription.isActive,
});

const resolveCustomer = async ({ customerId, customerPayload }) => {
  if (customerId) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    return customer || null;
  }

  if (!customerPayload) return null;

  const { type, name, phone, address } = customerPayload;
  const normalizedType = String(type || "").toUpperCase();
  if (!ALLOWED_CUSTOMER_TYPES.has(normalizedType) || !name || !phone || !address) {
    return null;
  }

  return prisma.customer.upsert({
    where: { phone: String(phone) },
    update: {
      type: normalizedType,
      name,
      address,
    },
    create: {
      type: normalizedType,
      name,
      phone: String(phone),
      address,
    },
  });
};

const consumeInventoryForSale = async (tx, { productId, quantity, source, note }) => {
  const rows = await tx.inventory.findMany({
    where: {
      productId,
      quantityAvailable: { gt: 0 },
    },
  });

  const inventories = sortInventoryForConsumption(rows);
  let remaining = Number(quantity);
  const consumedBatches = [];

  for (const batch of inventories) {
    if (remaining <= 0) break;
    const currentQty = Number(batch.quantityAvailable);
    if (currentQty <= 0) continue;

    const used = Math.min(currentQty, remaining);
    const updated = Number((currentQty - used).toFixed(3));

    await tx.inventory.update({
      where: { id: batch.id },
      data: { quantityAvailable: updated },
    });

    await tx.stockMovement.create({
      data: {
        productId,
        inventoryId: batch.id,
        batchId: batch.batchId,
        movementType: "REDUCE",
        quantity: Number(used.toFixed(3)),
        source,
        note,
      },
    });

    consumedBatches.push({
      batch_id: batch.batchId,
      reduced_quantity: Number(used.toFixed(3)),
      remaining_quantity: updated,
    });
    remaining = Number((remaining - used).toFixed(3));
  }

  if (remaining > 0) {
    return {
      ok: false,
      error: "insufficient stock for requested order quantity",
    };
  }

  return {
    ok: true,
    consumedBatches,
  };
};

const createOrderInTransaction = async (
  tx,
  { customerId, product, quantity, price, orderDate, source, subscriptionId, note },
) => {
  const inventoryReduction = await consumeInventoryForSale(tx, {
    productId: product.id,
    quantity,
    source,
    note,
  });
  if (!inventoryReduction.ok) {
    return {
      error: inventoryReduction.error,
    };
  }

  const total = Number((Number(quantity) * Number(price)).toFixed(2));
  const order = await tx.order.create({
    data: {
      customerId,
      productId: product.id,
      ...(subscriptionId && { subscriptionId }),
      quantity: Number(quantity),
      price: Number(price),
      total,
      orderDate,
      source,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  return {
    order,
    inventoryReduction,
  };
};

const generateDailyOrders = async ({ targetDate, subscriptionId = null }) => {
  const day = toStartOfDay(targetDate);
  const results = {
    generated_count: 0,
    skipped_existing: 0,
    failed: [],
  };

  const subscriptions = await prisma.subscription.findMany({
    where: {
      isActive: true,
      startDate: { lte: day },
      ...(subscriptionId && { id: subscriptionId }),
    },
    include: {
      product: true,
      customer: true,
    },
  });

  for (const subscription of subscriptions) {
    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.order.findFirst({
          where: {
            subscriptionId: subscription.id,
            orderDate: day,
          },
        });
        if (existing) {
          results.skipped_existing += 1;
          return;
        }

        const createResult = await createOrderInTransaction(tx, {
          customerId: subscription.customerId,
          product: subscription.product,
          quantity: Number(subscription.quantityPerDay),
          price: Number(subscription.product.sellingPrice),
          orderDate: day,
          source: "SUBSCRIPTION_AUTO",
          subscriptionId: subscription.id,
          note: `auto-generated for subscription ${subscription.id}`,
        });

        if (createResult.error) {
          throw new Error(createResult.error);
        }

        results.generated_count += 1;
      });
    } catch (error) {
      results.failed.push({
        subscription_id: subscription.id,
        customer_id: subscription.customerId,
        reason: error.message,
      });
    }
  }

  return results;
};

const createOrder = async (req, res, next) => {
  try {
    const {
      customer_id: customerId,
      customer,
      product_id: productId,
      quantity,
      price,
      order_date: orderDate,
    } = req.body;

    const errors = [];
    if (!productId) errors.push("product_id is required");
    if (quantity === undefined) errors.push("quantity is required");
    if (quantity !== undefined && parsePositive(quantity) === null) {
      errors.push("quantity must be greater than 0");
    }
    if (price !== undefined && parsePositive(price) === null) {
      errors.push("price must be greater than 0");
    }
    if (orderDate && Number.isNaN(new Date(orderDate).getTime())) {
      errors.push("order_date must be a valid date");
    }
    if (!customerId && !customer) {
      errors.push("either customer_id or customer payload is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resolvedCustomer = await resolveCustomer({ customerId, customerPayload: customer });
    if (!resolvedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found or customer payload invalid",
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const salePrice = price !== undefined ? Number(price) : Number(product.sellingPrice);
    const targetOrderDate = toStartOfDay(orderDate);

    const createResult = await prisma.$transaction(async (tx) =>
      createOrderInTransaction(tx, {
        customerId: resolvedCustomer.id,
        product,
        quantity: Number(quantity),
        price: salePrice,
        orderDate: targetOrderDate,
        source: "MANUAL",
        note: "manual sales order",
      }),
    );

    if (createResult.error) {
      return res.status(400).json({
        success: false,
        message: createResult.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        ...mapOrder(createResult.order),
        stock_consumption: createResult.inventoryReduction.consumedBatches,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { customer_id: customerId, date, product_id: productId } = req.query;

    const autoGeneration = await generateDailyOrders({ targetDate: new Date() });

    const where = {
      ...(customerId && { customerId }),
      ...(productId && { productId }),
    };

    if (date) {
      const dayStart = toStartOfDay(date);
      if (Number.isNaN(dayStart.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["date must be a valid date"],
        });
      }
      where.orderDate = dayStart;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        product: true,
      },
      orderBy: [{ orderDate: "desc" }, { createdAt: "desc" }],
    });

    return res.json({
      success: true,
      data: orders.map(mapOrder),
      auto_generated_daily_orders: autoGeneration,
    });
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const {
      customer_id: customerId,
      customer,
      product_id: productId,
      quantity_per_day: quantityPerDay,
      start_date: startDate,
      is_active: isActive,
    } = req.body;

    const errors = [];
    if (!productId) errors.push("product_id is required");
    if (quantityPerDay === undefined) errors.push("quantity_per_day is required");
    if (quantityPerDay !== undefined && parsePositive(quantityPerDay) === null) {
      errors.push("quantity_per_day must be greater than 0");
    }
    if (startDate && Number.isNaN(new Date(startDate).getTime())) {
      errors.push("start_date must be a valid date");
    }
    if (!customerId && !customer) {
      errors.push("either customer_id or customer payload is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resolvedCustomer = await resolveCustomer({ customerId, customerPayload: customer });
    if (!resolvedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found or customer payload invalid",
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const normalizedStartDate = toStartOfDay(startDate);
    const subscription = await prisma.subscription.create({
      data: {
        customerId: resolvedCustomer.id,
        productId,
        quantityPerDay: Number(quantityPerDay),
        startDate: normalizedStartDate,
        isActive: isActive === undefined ? true : Boolean(isActive),
      },
    });

    const autoGeneration = await generateDailyOrders({
      targetDate: new Date(),
      subscriptionId: subscription.id,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: mapSubscription(subscription),
      auto_generated_daily_orders: autoGeneration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  createSubscription,
};
