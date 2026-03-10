import axios from "axios";
const API_URL = "/api";

async function createPlayer(playerInfo) {
  const { first_name, last_name } = playerInfo;
  try {
    const res = await axios.post(
      `${API_URL}/players`,
      {
        first_name,
        last_name,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating player:", error);
    throw error;
  }
}

async function getAllPlayers() {
  try {
    const res = await axios.get(`${API_URL}/players`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Players:", error);
    throw error;
  }
}

async function getPlayer(id) {
  try {
    const res = await axios.get(`${API_URL}/players/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Player:", error);
    throw error;
  }
}

async function getPlayerGames(id) {
  try {
    const res = await axios.get(`${API_URL}/players/${id}/games`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Player Games:", error);
    throw error;
  }
}

async function getPlayerStats(id) {
      try {
        const res = await axios.get(`${API_URL}/players/${id}/stats`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error) {
        console.error("Error fetching Player Stats:", error);
        throw error;
      }
    }

export default {
  createPlayer,
  getAllPlayers,
  getPlayer,
  getPlayerGames,
  getPlayerStats
};
