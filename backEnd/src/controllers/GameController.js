import db from "../models/index.js";

const { Game, PlayerGame, Round, PlayerRound } = db;

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

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const startNewRound = async (req, res) => {
  try {
    const { game_id, round_id } = req.params;

    const [gameInfo, roundInfo] = await Promise.all([
      Game.findOne({ where: { id: game_id } }),
      Round.findOne({ where: { id: round_id } }),
    ]);

    if (!gameInfo || !roundInfo) {
      return res.status(404).json({ message: "Game or Round not found" });
    }

    const newPlayerRoundInfo = {};
    let prevRound = null;

    if (roundInfo.round_number > 1) {
      prevRound = await Round.findOne({
        where: {
          game_id: roundInfo.game_id,
          round_number: roundInfo.round_number - 1,
        },
      });
    }

    for (let player of gameInfo.players) {
      if (!req.body[player]) {
        console.warn(`No data provided for player ${player}`);
        continue;
      }

      const { bid, tricks_won, bonus_points, round_score } = req.body[player];

      if (roundInfo.round_number === 1) {
        const newInfo = await PlayerRound.create({
          bid,
          tricks_won,
          score: round_score,
          bonus_points,
          round_score,
          player_id: player,
          round_id,
        });
        newPlayerRoundInfo[player] = newInfo;
      } else {
        const prevPlayerRound = await PlayerRound.findOne({
          where: {
            player_id: player,
            round_id: prevRound.id,
          },
        });

        const prevScore = prevPlayerRound ? prevPlayerRound.score : 0;

        const newInfo = await PlayerRound.create({
          bid,
          tricks_won,
          score: prevScore + round_score,
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

export const getPlayerRound = async (req, res) => {
  try {
    const { player_id, round_id } = req.params;
    const playerRoundInfo = await PlayerRound.findAll({
      where: { player_id, round_id },
    });

    return res.status(200).json(playerRoundInfo);
  } catch (error) {
    console.error("Error finding round information");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPrevScore = async (req, res) => {
  try {
    const { player_id, round_id } = req.params;
    const playerRoundInfo = await PlayerRound.findAll({
      where: { player_id, round_id },
    });

    return res.status(200).json(playerRoundInfo[0].score);
  } catch (error) {
    console.error("Error finding round information");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
