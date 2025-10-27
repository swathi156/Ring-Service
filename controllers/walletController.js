const Wallet = require("../models/wallet");

exports.addWallet = async (req, res) => {
  try {
    const wallet = await Wallet.create(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { device_id: req.params.device_id } });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWallet = async (req, res) => {
  try {
    const { walletAmount } = req.body;
    await Wallet.update({ walletAmount }, { where: { device_id: req.params.device_id } });
    res.json({ message: "Wallet updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
