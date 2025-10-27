const sequelize = require("../config/db");
const Ring = require("./ringIdModel");
const Wallet = require("./wallet");
const WalletHistory = require("./walletHistory");
module.exports = { sequelize, Ring, Wallet, WalletHistory };
