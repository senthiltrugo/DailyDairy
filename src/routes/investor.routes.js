const express = require("express");
const {
  createInvestor,
  createInvestment,
  getInvestorById,
} = require("../controllers/investor.controller");

const router = express.Router();

/**
 * @swagger
 * /investors:
 *   post:
 *     summary: Create investor profile
 *     tags: [Investors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvestorRequest'
 *     responses:
 *       201:
 *         description: Investor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvestorCreateResponse'
 *             example:
 *               success: true
 *               message: Investor created successfully
 *               data:
 *                 id: ee860395-15b8-40c9-886e-f3cb48d2f705
 *                 name: Arun Prakash
 *                 phone: "9876540001"
 *                 email: arun.prakash@example.com
 *                 KYC_status: VERIFIED
 *                 created_at: "2026-04-18T14:00:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Investor duplicate by phone/email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 */
router.post("/investors", createInvestor);

/**
 * @swagger
 * /investments:
 *   post:
 *     summary: Record investor investment transaction
 *     tags: [Investors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvestmentRequest'
 *     responses:
 *       201:
 *         description: Investment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvestmentCreateResponse'
 *             example:
 *               success: true
 *               message: Investment recorded successfully
 *               data:
 *                 id: da5dd0de-c6bc-40c6-869b-b9cb26881356
 *                 investor_id: ee860395-15b8-40c9-886e-f3cb48d2f705
 *                 amount: 250000
 *                 category: value-added
 *                 date: "2026-04-18T00:00:00.000Z"
 *                 created_at: "2026-04-18T14:10:00.000Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Investor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 */
router.post("/investments", createInvestment);

/**
 * @swagger
 * /investor/{id}:
 *   get:
 *     summary: Get investor profile and investment history
 *     tags: [Investors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Investor profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvestorProfileResponse'
 *       404:
 *         description: Investor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleErrorResponse'
 */
router.get("/investor/:id", getInvestorById);

module.exports = router;
