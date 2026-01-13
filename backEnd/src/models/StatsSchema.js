import sequelize from "../db/connection.js";
import { DataTypes } from "sequelize";

const Stats = sequelize.define("stats", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  games_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  win_percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bet_success_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  wins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  losses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Stats;
