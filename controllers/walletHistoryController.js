const Wallet = require("../models/wallet");
const WalletHistory = require("../models/walletHistory");

exports.createTransaction = async (req, res) => {
  try {
    const { transactionAmount, transactionType } = req.body;
    const { device_id } = req.params; 

    // Find wallet first
    const wallet = await Wallet.findOne({ where: { device_id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Update wallet
    let finalAmount = wallet.walletAmount;
    if (transactionType === "credit") finalAmount += transactionAmount;
    if (transactionType === "debit") {
      if (transactionAmount > wallet.walletAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      finalAmount -= transactionAmount;
    }

    await Wallet.update(
      { walletAmount: finalAmount },
      { where: { device_id } }
    );

    // Insert transaction into history
    const history = await WalletHistory.create({
      device_id,           
      transactionAmount,
      transactionType,
    });

    res.status(201).json({
      message: "Transaction successful",
      walletBalance: finalAmount,
      history,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWalletHistory = async (req, res) => {
  try {
    const { device_id } = req.params;

    const history = await WalletHistory.findAll({
      where: { device_id },
      order: [["id", "DESC"]],
    });

    res.status(200).json({ data: history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
