const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/:device_id", paymentController.makePayment);

module.exports = router;
