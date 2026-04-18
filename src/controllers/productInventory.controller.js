const prisma = require("../config/prisma");
const { computeNextQuantity } = require("../utils/inventoryEngine");

const ALLOWED_PRODUCT_NAMES = new Set(["milk", "curd", "paneer", "ghee"]);
const ALLOWED_UNITS = new Set(["litre", "kg"]);

const mapProductResponse = (product) => ({
  id: product.id,
  name: product.name,
  unit: product.unit,
  selling_price: Number(product.sellingPrice),
  created_at: product.createdAt,
});

const mapInventoryRow = (inventory) => ({
  product_id: inventory.productId,
  product_name: inventory.product.name,
  unit: inventory.product.unit,
  quantity_available: Number(inventory.quantityAvailable),
  batch_id: inventory.batchId,
  expiry_date: inventory.expiryDate,
});

const createProduct = async (req, res, next) => {
  try {
    const { name, unit, selling_price: sellingPrice } = req.body;

    const errors = [];
    if (!name) errors.push("name is required");
    if (!unit) errors.push("unit is required");
    if (sellingPrice === undefined) errors.push("selling_price is required");

    if (name && !ALLOWED_PRODUCT_NAMES.has(String(name).toLowerCase())) {
      errors.push("name must be one of: milk, curd, paneer, ghee");
    }
    if (unit && !ALLOWED_UNITS.has(String(unit).toLowerCase())) {
      errors.push("unit must be one of: litre, kg");
    }
    if (
      sellingPrice !== undefined &&
      (!Number.isFinite(Number(sellingPrice)) || Number(sellingPrice) <= 0)
    ) {
      errors.push("selling_price must be greater than 0");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).toLowerCase(),
        unit: String(unit).toLowerCase(),
        sellingPrice: Number(sellingPrice),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: mapProductResponse(product),
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    const { product_id: productId } = req.query;

    const inventory = await prisma.inventory.findMany({
      where: {
        ...(productId && { productId }),
      },
      include: {
        product: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return res.json({
      success: true,
      data: inventory.map(mapInventoryRow),
    });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const {
      product_id: productId,
      batch_id: batchId,
      expiry_date: expiryDate,
      quantity,
      movement_type: movementType,
      source,
      note,
    } = req.body;

    const errors = [];
    if (!productId) errors.push("product_id is required");
    if (!batchId) errors.push("batch_id is required");
    if (quantity === undefined) errors.push("quantity is required");
    if (!movementType) errors.push("movement_type is required");
    if (
      expiryDate !== undefined &&
      expiryDate !== null &&
      expiryDate !== "" &&
      Number.isNaN(new Date(expiryDate).getTime())
    ) {
      errors.push("expiry_date must be a valid date");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingInventory = await tx.inventory.findUnique({
        where: {
          productId_batchId: {
            productId,
            batchId,
          },
        },
      });

      if (!existingInventory && String(movementType).toUpperCase() === "REDUCE") {
        return {
          error: {
            status: 400,
            message: "Cannot reduce stock for non-existing batch",
          },
        };
      }

      if (
        !existingInventory &&
        String(movementType).toUpperCase() === "INCREASE" &&
        (expiryDate === undefined || expiryDate === null || expiryDate === "")
      ) {
        return {
          error: {
            status: 400,
            message: "expiry_date is required when creating a new inventory batch",
          },
        };
      }

      const stockComputation = computeNextQuantity({
        currentQuantity: existingInventory ? existingInventory.quantityAvailable : 0,
        movementType,
        quantity,
      });

      if (!stockComputation.ok) {
        return {
          error: {
            status: 400,
            message: stockComputation.error,
          },
        };
      }

      const inventory = existingInventory
        ? await tx.inventory.update({
            where: { id: existingInventory.id },
            data: {
              quantityAvailable: stockComputation.nextQuantity,
              ...(expiryDate !== undefined && {
                expiryDate: expiryDate ? new Date(expiryDate) : null,
              }),
            },
            include: { product: true },
          })
        : await tx.inventory.create({
            data: {
              productId,
              batchId,
              quantityAvailable: stockComputation.nextQuantity,
              ...(expiryDate && { expiryDate: new Date(expiryDate) }),
            },
            include: { product: true },
          });

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          inventoryId: inventory.id,
          batchId,
          movementType: stockComputation.movementType,
          quantity: stockComputation.quantity,
          ...(source && { source }),
          ...(note && { note }),
        },
      });

      return {
        inventory,
        movement,
        stockComputation,
      };
    });

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.json({
      success: true,
      message: "Stock updated successfully",
      data: {
        ...mapInventoryRow(result.inventory),
        movement: {
          id: result.movement.id,
          movement_type: result.movement.movementType,
          quantity: Number(result.movement.quantity),
          source: result.movement.source,
          note: result.movement.note,
          created_at: result.movement.createdAt,
        },
        stock_balance: {
          previous_quantity: result.stockComputation.previousQuantity,
          updated_quantity: result.stockComputation.nextQuantity,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getInventory,
  updateStock,
};
