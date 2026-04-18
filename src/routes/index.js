const express = require("express");
const farmerRoutes = require("./farmer.routes");
const milkProcurementRoutes = require("./milkProcurement.routes");

const router = express.Router();

router.use("/farmers", farmerRoutes);
router.use("/", milkProcurementRoutes);

module.exports = router;
