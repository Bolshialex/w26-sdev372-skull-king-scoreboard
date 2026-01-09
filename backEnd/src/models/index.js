import Game from "./GameSchema.js";
import PlayerGame from "./PlayerGameSchema.js";
import PlayerRound from "./PlayerRoundSchema.js";
import Round from "./roundSchema.js";
import Stats from "./StatsSchema.js";
import Player from "./PlayerSchema.js";
import sequelize from "../db/connection.js";

// Player - Stats
Player.hasOne(Stats, {
  foreignKey: "player_id",
});
Stats.belongsTo(Player, { foreignKey: "player_id" });

// Player < PlayerGame
Player.hasMany(PlayerGame, {
  foreignKey: "player_id",
});
PlayerGame.belongsTo(Player, {
  foreignKey: "player_id",
});

// Player > PlayerRound
Player.hasMany(PlayerRound, {
  foreignKey: "player_id",
});
PlayerRound.belongsTo(Player, {
  foreignKey: "player_id",
});

// Game < PlayerGame
Game.hasMany(PlayerGame, {
  foreignKey: "game_id",
});
Round.belongsTo(Game, {
  foreignKey: "game_id",
});

// Game < Round
Game.hasMany(Round, {
  foreignKey: "game_id",
});
Round.belongsTo(Game, {
  foreignKey: "game_id",
});

// Round < PlayerRound
Round.hasMany(PlayerRound, {
  foreignKey: "round_id",
});
PlayerRound.belongsTo(Round, {
  foreignKey: "round_id",
});

const db = {
  sequelize,
  Game,
  Player,
  Stats,
  Round,
  PlayerGame,
  PlayerRound,
};

export default db;
