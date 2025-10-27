const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ring = require("./ringIdModel");

const Wallet = sequelize.define("Wallet", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: { type: DataTypes.STRING, allowNull: false, unique: true }, 
  walletAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
});



Ring.hasOne(Wallet, { foreignKey: "device_id", sourceKey: "device_id" });
Wallet.belongsTo(Ring, { foreignKey: "device_id", targetKey: "device_id" });

module.exports = Wallet;
