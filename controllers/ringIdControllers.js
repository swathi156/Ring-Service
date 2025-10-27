const Ring = require("../models/ringIdModel");

exports.addRingId = async (req, res) => {
  try {
    const ring = await Ring.create(req.body);
    res.status(201).json({ message: "Ring ID added", data: ring });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRingIds = async (req, res) => {
  try {
    const rings = await Ring.findAll();
    res.json(rings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
