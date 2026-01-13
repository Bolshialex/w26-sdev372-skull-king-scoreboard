import sequelize from "../db/connection.js";
import { DataTypes } from "sequelize"

const Round = sequelize.define("round", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  round_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  }
});

export default Round;

