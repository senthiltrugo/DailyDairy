const express = require("express");
const {
  createProduct,
  getInventory,
  updateStock,
} = require("../controllers/productInventory.controller");

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product master entry
 *     tags: [Product & Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCreateResponse'
 *             example:
 *               success: true
 *               message: Product created successfully
 *               data:
 *                 id: 9f4f680f-c72f-4f38-a5be-905281f7b2aa
 *                 name: paneer
 *                 unit: kg
 *                 selling_price: 340
 *                 created_at: "2026-04-18T13:00:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Product already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductExistsResponse'
 */
router.post("/products", createProduct);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get inventory across product batches
 *     tags: [Product & Inventory]
 *     parameters:
 *       - in: query
 *         name: product_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter inventory by product
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - product_id: 9f4f680f-c72f-4f38-a5be-905281f7b2aa
 *                   product_name: paneer
 *                   unit: kg
 *                   quantity_available: 120.5
 *                   batch_id: BATCH-PANEER-001
 *                   expiry_date: "2026-04-30T00:00:00.000Z"
 */
router.get("/inventory", getInventory);

/**
 * @swagger
 * /update-stock:
 *   post:
 *     summary: Update stock quantity for a product batch
 *     tags: [Product & Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockRequest'
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateStockResponse'
 *             example:
 *               success: true
 *               message: Stock updated successfully
 *               data:
 *                 product_id: 9f4f680f-c72f-4f38-a5be-905281f7b2aa
 *                 product_name: paneer
 *                 unit: kg
 *                 quantity_available: 120.5
 *                 batch_id: BATCH-PANEER-001
 *                 expiry_date: "2026-04-30T00:00:00.000Z"
 *                 movement:
 *                   id: 14ebeb8f-529f-4452-9120-72f2cb6fc9cb
 *                   movement_type: INCREASE
 *                   quantity: 20
 *                   source: processing
 *                   note: from dispatch output
 *                   created_at: "2026-04-18T13:05:00.000Z"
 *                 stock_balance:
 *                   previous_quantity: 100.5
 *                   updated_quantity: 120.5
 *       400:
 *         description: Validation or stock balance failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               insufficientStock:
 *                 summary: Sale request exceeds available quantity
 *                 value:
 *                   success: false
 *                   message: insufficient stock for requested reduction
 *               missingExpiryForNewBatch:
 *                 summary: New batch without expiry on INCREASE
 *                 value:
 *                   success: false
 *                   message: expiry_date is required when creating a new inventory batch
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 */
router.post("/update-stock", updateStock);

module.exports = router;
