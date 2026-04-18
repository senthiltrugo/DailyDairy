const express = require("express");
const {
  createOrder,
  getOrders,
  createSubscription,
} = require("../controllers/sales.controller");

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create sales order and reduce stock
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCreateResponse'
 *             example:
 *               success: true
 *               message: Order created successfully
 *               data:
 *                 id: d3d58f93-f455-4b7d-86a9-4f3f4e53b622
 *                 customer_id: 3d4acacd-7363-4be2-82f1-c55c3980e39b
 *                 product_id: 26c59de8-153a-49be-8d90-205f822fa65e
 *                 subscription_id: null
 *                 quantity: 3
 *                 price: 62
 *                 total: 186
 *                 order_date: "2026-04-18T00:00:00.000Z"
 *                 source: MANUAL
 *                 customer:
 *                   id: 3d4acacd-7363-4be2-82f1-c55c3980e39b
 *                   type: D2C
 *                   name: Priya
 *                   phone: "9876501234"
 *                   address: "12 Lake View Street"
 *                 product:
 *                   id: 26c59de8-153a-49be-8d90-205f822fa65e
 *                   name: milk
 *                   unit: litre
 *                 stock_consumption:
 *                   - batch_id: BATCH-MILK-001
 *                     reduced_quantity: 3
 *                     remaining_quantity: 45
 *       400:
 *         description: Validation or stock failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 *       404:
 *         description: Product or customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 *   get:
 *     summary: List orders and auto-generate daily subscription orders
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: product_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       400:
 *         description: Invalid date filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.post("/orders", createOrder);
router.get("/orders", getOrders);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create daily milk subscription and auto-generate today's order
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionRequest'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionCreateResponse'
 *             example:
 *               success: true
 *               message: Subscription created successfully
 *               data:
 *                 id: 85fc4aa0-367d-4a9d-a43a-9ff70fcb90f8
 *                 customer_id: 3d4acacd-7363-4be2-82f1-c55c3980e39b
 *                 product_id: 26c59de8-153a-49be-8d90-205f822fa65e
 *                 quantity_per_day: 2
 *                 start_date: "2026-04-18T00:00:00.000Z"
 *                 is_active: true
 *               auto_generated_daily_orders:
 *                 generated_count: 1
 *                 skipped_existing: 0
 *                 failed: []
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Product or customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 */
router.post("/subscriptions", createSubscription);

module.exports = router;
