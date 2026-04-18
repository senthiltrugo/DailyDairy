const express = require("express");
const {
  createManufacturer,
  createMilkDispatch,
  getProcessingReport,
} = require("../controllers/processingPartner.controller");

const router = express.Router();

/**
 * @swagger
 * /manufacturers:
 *   post:
 *     summary: Create processing manufacturer
 *     tags: [Processing Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateManufacturerRequest'
 *     responses:
 *       201:
 *         description: Manufacturer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ManufacturerCreateResponse'
 *             example:
 *               success: true
 *               message: Manufacturer created successfully
 *               data:
 *                 id: c2d57f2a-02cf-4892-a210-9f5c4ac5f2de
 *                 name: ABC Dairy Products
 *                 location: Madurai Industrial Estate
 *                 capacity_per_day: 8000
 *                 supported_products:
 *                   - paneer
 *                   - ghee
 *                 created_at: "2026-04-18T12:30:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.post("/manufacturers", createManufacturer);

/**
 * @swagger
 * /dispatch-milk:
 *   post:
 *     summary: Dispatch milk from collection center to manufacturer
 *     tags: [Processing Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMilkDispatchRequest'
 *     responses:
 *       201:
 *         description: Milk dispatch created with conversion output
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MilkDispatchCreateResponse'
 *             example:
 *               success: true
 *               message: Milk dispatched successfully
 *               data:
 *                 id: d2bf4cb7-47ee-4487-ad4e-15e7183e0674
 *                 center_id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                 manufacturer_id: c2d57f2a-02cf-4892-a210-9f5c4ac5f2de
 *                 quantity: 500
 *                 date: "2026-04-18T00:00:00.000Z"
 *                 paneer_output_kg: 50
 *                 ghee_output_kg: 20
 *                 conversion_output:
 *                   input_milk_litres: 500
 *                   paneer_output_kg: 50
 *                   ghee_output_kg: 20
 *                   conversion_rules:
 *                     paneer: 10L milk -> 1kg paneer
 *                     ghee: 25L milk -> 1kg ghee
 *               manufacturer_capacity_status:
 *                 manufacturer_id: c2d57f2a-02cf-4892-a210-9f5c4ac5f2de
 *                 date: "2026-04-18"
 *                 daily_input_milk_litres: 7600
 *                 capacity_per_day: 8000
 *                 alert: OK
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Collection center or manufacturer not found
 */
router.post("/dispatch-milk", createMilkDispatch);

/**
 * @swagger
 * /processing-report:
 *   get:
 *     summary: Get daily processing report (input milk and output products)
 *     tags: [Processing Partner]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format. Defaults to today.
 *       - in: query
 *         name: manufacturer_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter report to one manufacturer.
 *     responses:
 *       200:
 *         description: Processing report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessingReportResponse'
 *             example:
 *               success: true
 *               data:
 *                 - manufacturer_id: c2d57f2a-02cf-4892-a210-9f5c4ac5f2de
 *                   manufacturer_name: ABC Dairy Products
 *                   location: Madurai Industrial Estate
 *                   date: "2026-04-18"
 *                   input_milk_litres: 7600
 *                   output_products:
 *                     paneer_kg: 760
 *                     ghee_kg: 304
 *                   dispatches:
 *                     - dispatch_id: d2bf4cb7-47ee-4487-ad4e-15e7183e0674
 *                       center_id: 6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3
 *                       center_name: Center A
 *                       quantity: 500
 *               conversion_rules:
 *                 paneer: 10L milk -> 1kg paneer
 *                 ghee: 25L milk -> 1kg ghee
 *               aggregation_query:
 *                 type: prisma
 *                 description: Grouped daily input milk and output products by manufacturer
 *                 pseudo_sql: SELECT manufacturer_id, DATE(date) AS day, SUM(quantity) AS input_litres, SUM(paneer_output_kg) AS paneer_kg, SUM(ghee_output_kg) AS ghee_kg FROM milk_dispatches WHERE date >= :start AND date < :end GROUP BY manufacturer_id, DATE(date)
 *       400:
 *         description: Invalid date filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get("/processing-report", getProcessingReport);

module.exports = router;
