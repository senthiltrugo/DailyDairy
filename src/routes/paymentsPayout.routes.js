const express = require("express");
const {
  getFarmerPayouts,
  getInvestorPayouts,
} = require("../controllers/paymentsPayout.controller");

const router = express.Router();

/**
 * @swagger
 * /farmer-payouts:
 *   get:
 *     summary: Get farmer payouts based on milk entries
 *     tags: [Payments & Payout]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Any date in target month (YYYY-MM-DD). Defaults to current month.
 *     responses:
 *       200:
 *         description: Farmer payouts calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerPayoutsResponse'
 *             example:
 *               success: true
 *               month: "2026-04"
 *               data:
 *                 - farmer_id: 2de1c147-2de8-479c-8f0e-4b0afcbccf8d
 *                   farmer_name: Ravi Kumar
 *                   phone: "9876543210"
 *                   total_quantity_litres: 320.5
 *                   total_payout_amount: 12890
 *                   entries_count: 5
 *               totals:
 *                 farmers_count: 1
 *                 grand_total_payout_amount: 12890
 *               payout_logic: Farmer payout is based on milk entries total_amount in the selected month.
 *       400:
 *         description: Invalid date filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get("/farmer-payouts", getFarmerPayouts);

/**
 * @swagger
 * /investor-payouts:
 *   get:
 *     summary: Get monthly investor payout calculations
 *     tags: [Payments & Payout]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Any date in target month (YYYY-MM-DD). Defaults to current month.
 *     responses:
 *       200:
 *         description: Investor payouts calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvestorPayoutsResponse'
 *             example:
 *               success: true
 *               month: "2026-04"
 *               data:
 *                 - investor_id: ee860395-15b8-40c9-886e-f3cb48d2f705
 *                   investor_name: Arun Prakash
 *                   month: "2026-04"
 *                   invested_amount: 400000
 *                   investments_count: 3
 *                   monthly_returns_by_category:
 *                     milk: 15000
 *                     hubs: 33000
 *                     value-added: 45000
 *                   total_monthly_return: 93000
 *               totals:
 *                 investors_count: 1
 *                 grand_total_monthly_return: 93000
 *               payout_logic:
 *                 milk: "15% of monthly investment in milk category"
 *                 hubs: "22% of monthly investment in hub category"
 *                 value_added: "30% of monthly investment in value-added category"
 *       400:
 *         description: Invalid date filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get("/investor-payouts", getInvestorPayouts);

module.exports = router;
