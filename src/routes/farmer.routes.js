const express = require("express");
const {
  createFarmer,
  getFarmers,
  updateFarmer,
} = require("../controllers/farmer.controller");

const router = express.Router();

/**
 * @swagger
 * /farmers:
 *   post:
 *     summary: Create a farmer
 *     tags: [Farmers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFarmerRequest'
 *     responses:
 *       201:
 *         description: Farmer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerCreateResponse'
 *             example:
 *               success: true
 *               message: Farmer created successfully
 *               data:
 *                 id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                 name: Ravi Kumar
 *                 phone: "9876543210"
 *                 village: Kovilpatti
 *                 district: Thoothukudi
 *                 bank_account_number: "123456789012"
 *                 ifsc_code: SBIN0000123
 *                 number_of_cattle: 12
 *                 avg_daily_milk_litres: 95.5
 *                 created_at: "2026-04-18T10:15:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: Validation failed
 *               errors:
 *                 - name is required
 *   get:
 *     summary: List all farmers
 *     tags: [Farmers]
 *     responses:
 *       200:
 *         description: Farmers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                   name: Ravi Kumar
 *                   phone: "9876543210"
 *                   village: Kovilpatti
 *                   district: Thoothukudi
 *                   bank_account_number: "123456789012"
 *                   ifsc_code: SBIN0000123
 *                   number_of_cattle: 12
 *                   avg_daily_milk_litres: 95.5
 *                   created_at: "2026-04-18T10:15:00.000Z"
 */
router.post("/", createFarmer);
router.get("/", getFarmers);

/**
 * @swagger
 * /farmers/{id}:
 *   put:
 *     summary: Update farmer details
 *     tags: [Farmers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFarmerRequest'
 *     responses:
 *       200:
 *         description: Farmer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerUpdateResponse'
 *             example:
 *               success: true
 *               message: Farmer updated successfully
 *               data:
 *                 id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                 name: Ravi Kumar
 *                 phone: "9876543210"
 *                 village: Ettayapuram
 *                 district: Thoothukudi
 *                 bank_account_number: "123456789012"
 *                 ifsc_code: SBIN0000123
 *                 number_of_cattle: 14
 *                 avg_daily_milk_litres: 95.5
 *                 created_at: "2026-04-18T10:15:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: Validation failed
 *               errors:
 *                 - number_of_cattle must be a non-negative number
 *       404:
 *         description: Farmer not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Farmer not found
 */
router.put("/:id", updateFarmer);

module.exports = router;
