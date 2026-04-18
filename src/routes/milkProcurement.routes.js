const express = require("express");
const {
  createMilkEntry,
  getMilkEntries,
} = require("../controllers/milkProcurement.controller");

const router = express.Router();

/**
 * @swagger
 * /milk-entry:
 *   post:
 *     summary: Create milk procurement entry
 *     tags: [Milk Procurement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMilkEntryRequest'
 *     responses:
 *       201:
 *         description: Milk entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MilkEntryCreateResponse'
 *             example:
 *               success: true
 *               message: Milk entry created successfully
 *               data:
 *                 id: 4ad074bf-e4ae-4b8d-b77e-e45d7360e7f8
 *                 farmer_id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                 date: "2026-04-18T00:00:00.000Z"
 *                 quantity_litres: 100
 *                 fat_percentage: 4.2
 *                 snf_percentage: 8.4
 *                 price_per_litre: 39
 *                 total_amount: 4100
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               quantityError:
 *                 summary: quantity <= 0 rejected
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - quantity_litres must be greater than 0
 *               fatMissingError:
 *                 summary: fat% missing rejected
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - fat_percentage is required
 *       404:
 *         description: Farmer not found
 */
router.post("/milk-entry", createMilkEntry);

/**
 * @swagger
 * /milk-entries:
 *   get:
 *     summary: List milk procurement entries with optional filters
 *     tags: [Milk Procurement]
 *     parameters:
 *       - in: query
 *         name: farmer_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filter by farmer UUID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter entries by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Milk entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MilkEntryListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 4ad074bf-e4ae-4b8d-b77e-e45d7360e7f8
 *                   farmer_id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                   date: "2026-04-18T00:00:00.000Z"
 *                   quantity_litres: 100
 *                   fat_percentage: 4.2
 *                   snf_percentage: 8.4
 *                   price_per_litre: 39
 *                   total_amount: 4100
 *       400:
 *         description: Invalid date filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: Validation failed
 *               errors:
 *                 - date must be a valid date
 */
router.get("/milk-entries", getMilkEntries);

module.exports = router;
