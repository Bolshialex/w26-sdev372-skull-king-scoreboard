import axios from "axios";
const API_URL = "http://localhost:3056";

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
      }
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
