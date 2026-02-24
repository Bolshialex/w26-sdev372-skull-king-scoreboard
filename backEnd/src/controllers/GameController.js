import db from "../models/index.js";
import PlayerRound from "../models/PlayerRoundSchema.js";

const Game = db.Game;
const Round = db.Round;
const PlayerGame = db.PlayerGame;

export const createGame = async (req, res) => {
  try {
    const STARTING_ROUND = 1;
    const { players, rounds_needed } = req.body;

    const game = await Game.create({
      rounds_needed,
      players,
    });

    for (const player of players)
      await PlayerGame.create({ game_id: game.id, player_id: player });

    const round = await Round.create({
      game_id: game.id,
      round_number: STARTING_ROUND,
    });

    return res
      .status(201)
      .json({ message: "Game Created", round_info: round, game_info: game });
  } catch (error) {
    console.error("Error creating game:", error);

    return res.status(500).json({ messcage: "Internal Server Error" });
  }
};

export const startNewRound = async (req, res) => {
  //create a new round grabbing the game id and the current round number
  const { game_id, round_id } = req.params;

  const gameInfo = await Game.findOne({ where: { id: game_id } });
  const roundInfo = await Round.findOne({ where: { id: round_id } });

  const newPlayerRoundInfo = {};
  try {
    for (let player of gameInfo.players) {
      const { bid, tricks_won, bonus_points, round_score } = req.body[player];
      console.log(req.body[player]);
      if (roundInfo.round_number === 1) {
        const newInfo = await PlayerRound.create({
          bid,
          tricks_won,
          score: round_score + bonus_points,
          bonus_points,
          round_score,
          player_id: player,
          round_id,
        });
        newPlayerRoundInfo[player] = newInfo;
      } else {
        const prevRound = await Round.findOne({
          where: {
            game_id: roundInfo.game_id,
            round_number: roundInfo.round_number - 1,
          },
        });
        console.log({ prevRound: prevRound });
        const prevPlayerRound = await PlayerRound.findOne({
          where: {
            player_id: player,
            round_id: prevRound.id,
          },
        });
        console.log({ prevPlayer: prevPlayerRound });
        const newInfo = await PlayerRound.create({
          bid,
          tricks_won,
          score: prevPlayerRound.score + round_score + bonus_points,
          bonus_points,
          round_score,
          player_id: player,
          round_id,
        });

        newPlayerRoundInfo[player] = newInfo;
      }
    }
    const newRound = await Round.create({
      game_id: roundInfo.game_id,
      round_number: roundInfo.round_number + 1,
    });

    return res.status(201).json({ newRound, newPlayerRoundInfo });
  } catch (error) {
    console.error("Error creating round info:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
