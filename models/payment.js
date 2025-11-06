const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ring = require("./ringIdModel");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transaction_type: {
    type: DataTypes.ENUM("credit", "debit"),
    allowNull: false
  },
  transaction_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Relationship
Ring.hasMany(Payment, { foreignKey: "device_id", sourceKey: "device_id" });
Payment.belongsTo(Ring, { foreignKey: "device_id", targetKey: "device_id" });

module.exports = Payment;
