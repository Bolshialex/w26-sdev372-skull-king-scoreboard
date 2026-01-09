import sequelize from "../db/connection.js";
import { DataTypes } from "sequelize";

const PlayerRound = sequelize.define("player_round", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  bid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tricks_won: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  round_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bonus_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default PlayerRound;
