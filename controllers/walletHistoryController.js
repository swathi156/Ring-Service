const Wallet = require("../models/wallet");
const WalletHistory = require("../models/walletHistory");

exports.createTransaction = async (req, res) => {
  try {
    const { transactionAmount, transactionType } = req.body;
    const { device_id } = req.params;

    // Find wallet
    const wallet = await Wallet.findOne({ where: { device_id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Ensure numeric conversion
    const beforeAmount = Number(wallet.walletAmount);
    const amount = Number(transactionAmount);
    let afterAmount = beforeAmount;

    // Credit or Debit Logic
    if (transactionType === "credit") {
      afterAmount = beforeAmount + amount;
    } else if (transactionType === "debit") {
      if (amount > beforeAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      afterAmount = beforeAmount - amount;
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Update wallet
    await Wallet.update({ walletAmount: afterAmount }, { where: { device_id } });

    // Save transaction history
    const history = await WalletHistory.create({
      device_id,
      transactionAmount: amount,
      transactionType,
      walletBalanceBefore: beforeAmount,
      walletBalanceAfter: afterAmount,
    });

    // Response
    res.status(201).json({
      message: "Transaction successful",
      walletBalance: afterAmount,
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
