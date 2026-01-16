import db from "../models/index.js";

const Game = db.Game;
const Round = db.Round;
const PlayerGame = db.PlayerGame;

export const createGame = async (req, res) => {
  try {
    const STARTING_ROUND = 1;
    const { players, rounds_needed } = req.body;

    const game = await Game.create({ rounds_needed, players });

    for (const player of players)
      await PlayerGame.create({ game_id: game.id, player_id: player });

    const round = await Round.create({ game_id: game.id, round_number: STARTING_ROUND });

    return res
      .status(201)
      .json({ message: "Game Created", round_info: round, game_info: game });
  } catch (error) {
    console.error("Error creating game:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};