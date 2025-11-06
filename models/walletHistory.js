const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Wallet = require("./wallet");

const WalletHistory = sequelize.define("WalletHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: { type: DataTypes.STRING, allowNull: false },
  transactionAmount: { type: DataTypes.FLOAT, allowNull: false },
  transactionType: { type: DataTypes.ENUM("credit", "debit"), allowNull: false },
  walletBalanceBefore: { type: DataTypes.FLOAT, allowNull: true },
  walletBalanceAfter: { type: DataTypes.FLOAT, allowNull: true },
});

// Relationship
Wallet.hasMany(WalletHistory, { foreignKey: "device_id", sourceKey: "device_id" });
WalletHistory.belongsTo(Wallet, { foreignKey: "device_id", targetKey: "device_id" });


module.exports = WalletHistory;
