import axios from "axios";
const API_URL = "/api";

async function createGame(gameInfo) {
  const { playersArray, numRounds } = gameInfo;
  console.log(playersArray);
  try {
    const res = await axios.post(
      `${API_URL}/game`,
      {
        players: playersArray,
        rounds_needed: numRounds,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
}

async function getPlayerRoundInfoFirstRound(playerId) {
  try {
    const res = await axios.get(`${API_URL}/players/${playerId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching player round info:", error);
    throw error;
  }
}
async function getPlayerRoundInfo(player_id, round_id) {
  try {
    const playerInfo = await axios.get(`${API_URL}/players/${player_id}`);
    const playerRoundInfo = await axios.get(
      `${API_URL}/player-round/${player_id}/${round_id}`,
    );

    return [playerInfo.data, playerRoundInfo.data];
  } catch (error) {
    console.error("Error getting player-round info:", error);
    throw error;
  }
}

async function addRound(gameId, roundId, payload) {
  try {
    const res = await axios.post(
      `${API_URL}/game/${gameId}/${roundId}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error adding round:", error);
    throw error;
  }
}

async function getPlayerScore(playerId, roundId) {
  try {
    const res = await axios.get(`${API_URL}/game/${playerId}/${roundId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting player score:", error);
    throw error;
  }
}

export default {
  createGame,
  getPlayerRoundInfo,
  addRound,
  getPlayerRoundInfoFirstRound,
  getPlayerScore,
};
