const { Payment, Wallet } = require("../models");

exports.makePayment = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { transaction_type, transaction_amount } = req.body;

    const wallet = await Wallet.findOne({ where: { device_id } });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (transaction_amount > wallet.walletAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const payment = await Payment.create({
      device_id,
      transaction_type,
      transaction_amount
    });

    wallet.walletAmount = wallet.walletAmount - transaction_amount;
    await wallet.save();

    res.status(201).json({
      message: "Payment successful",
      payment,
      walletBalance: wallet.walletAmount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
