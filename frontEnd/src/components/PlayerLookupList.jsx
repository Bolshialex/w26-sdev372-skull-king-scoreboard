import { useEffect, useState } from "react";
import playerFunctions from "../api/playerFunctions";

function PlayerLookup() {
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const data = await playerFunctions.getAllPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Failed to load players:", error);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div>
          <div>
            <input
              type="text"           
              placeholder="Search Players"
            />
          </div>
          <div>
            {players.map((player) => (
              <button key={player.id}>
                <p>Player</p>
                <p>
                  {player.first_name} {player.last_name}
                </p>
              </button>
            ))}
          </div>
        </div>
  )
}

export default PlayerLookup;