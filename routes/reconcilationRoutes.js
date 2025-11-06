const express = require("express");
const router = express.Router();
const reconciliationController = require("../controllers/reconciliationController");


router.get("/report", reconciliationController.getReconciliationReport);

module.exports = router;
