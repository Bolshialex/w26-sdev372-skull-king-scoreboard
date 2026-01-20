import axios from "axios";
const API_URL = "http://localhost:3056";

async function createGame(gameInfo) {
  const { playerArray, numRounds } = gameInfo;
  try {
    const res = await axios.post(
      `${API_URL}/game`,
      {
        players: playerArray,
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

export default {
  createGame,
};
