const express = require("express");
const farmerRoutes = require("./farmer.routes");
const milkProcurementRoutes = require("./milkProcurement.routes");
const collectionLogisticsRoutes = require("./collectionLogistics.routes");
const processingPartnerRoutes = require("./processingPartner.routes");
const productInventoryRoutes = require("./productInventory.routes");

const router = express.Router();

router.use("/farmers", farmerRoutes);
router.use("/", milkProcurementRoutes);
router.use("/", collectionLogisticsRoutes);
router.use("/", processingPartnerRoutes);
router.use("/", productInventoryRoutes);

module.exports = router;
