const express = require("express");
const router = express.Router();
const walletHistoryController = require("../controllers/walletHistoryController");

router.post("/wallet/:device_id/transaction", walletHistoryController.createTransaction);
router.get("/wallet/:device_id/history", walletHistoryController.getWalletHistory);


module.exports = router;
