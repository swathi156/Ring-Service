const express = require("express");
const router = express.Router();
const ringIdController = require("../controllers/ringIdController");

router.post("/", ringIdController.addRingId);
router.get("/", ringIdController.getAllRingIds);

module.exports = router;
