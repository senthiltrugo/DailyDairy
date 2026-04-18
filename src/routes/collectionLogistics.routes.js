const express = require("express");
const {
  createCollectionCenter,
  getCollectionCenters,
  createCollectionRecord,
  getDailyCollectionSummary,
} = require("../controllers/collectionLogistics.controller");

const router = express.Router();

/**
 * @swagger
 * /collection-centers:
 *   post:
 *     summary: Create a collection center
 *     tags: [Collection Logistics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollectionCenterRequest'
 *     responses:
 *       201:
 *         description: Collection center created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionCenterCreateResponse'
 *             example:
 *               success: true
 *               message: Collection center created successfully
 *               data:
 *                 id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                 name: Center A
 *                 location: Thoothukudi Main Road
 *                 capacity_litres: 5000
 *                 manager_name: Suresh Babu
 *                 latitude: 8.805038
 *                 longitude: 78.151884
 *                 created_at: "2026-04-18T12:00:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *   get:
 *     summary: List collection centers
 *     tags: [Collection Logistics]
 *     responses:
 *       200:
 *         description: Collection centers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionCenterListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                   name: Center A
 *                   location: Thoothukudi Main Road
 *                   capacity_litres: 5000
 *                   manager_name: Suresh Babu
 *                   latitude: 8.805038
 *                   longitude: 78.151884
 *                   created_at: "2026-04-18T12:00:00.000Z"
 */
router.post("/collection-centers", createCollectionCenter);
router.get("/collection-centers", getCollectionCenters);

/**
 * @swagger
 * /collect-milk:
 *   post:
 *     summary: Collect milk at assigned/nearest center
 *     tags: [Collection Logistics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollectionRecordRequest'
 *     responses:
 *       201:
 *         description: Milk collected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionRecordCreateResponse'
 *             example:
 *               success: true
 *               message: Milk collected successfully
 *               data:
 *                 id: f861b35e-a228-43fd-a297-5689e8c2cc69
 *                 farmer_id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                 center_id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                 quantity: 250
 *                 timestamp: "2026-04-18T06:00:00.000Z"
 *                 assigned_center:
 *                   id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                   name: Center A
 *                   location: Thoothukudi Main Road
 *               daily_capacity_status:
 *                 center_id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                 date: "2026-04-18"
 *                 daily_total_quantity: 5100
 *                 capacity_litres: 5000
 *                 alert: CAPACITY_EXCEEDED
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Farmer or collection center not found
 */
router.post("/collect-milk", createCollectionRecord);

/**
 * @swagger
 * /daily-collection-summary:
 *   get:
 *     summary: Daily total quantity per center with capacity alert
 *     tags: [Collection Logistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date in YYYY-MM-DD format. Defaults to today.
 *     responses:
 *       200:
 *         description: Daily summary computed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyCollectionSummaryResponse'
 *             example:
 *               success: true
 *               data:
 *                 - center_id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                   center_name: Center A
 *                   location: Thoothukudi Main Road
 *                   date: "2026-04-18"
 *                   daily_total_quantity: 5100
 *                   capacity_litres: 5000
 *                   alert: CAPACITY_EXCEEDED
 *               aggregation_query:
 *                 type: prisma
 *                 description: Daily total quantity collected per center
 *                 pseudo_sql: SELECT center_id, DATE(timestamp) AS date, SUM(quantity) AS daily_total FROM collection_records WHERE timestamp >= :start AND timestamp < :end GROUP BY center_id, DATE(timestamp)
 *       400:
 *         description: Invalid date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get("/daily-collection-summary", getDailyCollectionSummary);

module.exports = router;
