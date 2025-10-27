const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

router.post("/", walletController.addWallet);
router.get("/:device_id", walletController.getWallet);
router.put("/:device_id", walletController.updateWallet);

module.exports = router;
