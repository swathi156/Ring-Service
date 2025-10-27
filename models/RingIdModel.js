const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ring = sequelize.define("Ring", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  device_model: DataTypes.STRING,
  device_name: DataTypes.STRING,
  device_brand: DataTypes.STRING,
  device_version: DataTypes.STRING,
});

module.exports = Ring;
