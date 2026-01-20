import React, { useEffect, useState } from "react";
import gameFunctions from "../api/gameFunctions";
import playerFunctions from "../api/playerFunctions";

function GameCreationForm() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchAllPlayers() {
      try {
        const data = await playerFunctions.getAllPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Failed to load players:", error);
      }
    }
    fetchAllPlayers();
  }, []);
  return (
    <form>
      <div>
        <label htmlFor="rounds">Number of Rounds</label>
        <select name="rounds" id="rounds">
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="player">Player</label>
        <select name="player" id="player">
          <option value="name">name</option>
          <option value="of">of</option>
          <option value="players">players</option>
          <option value="dynamically">dynamically</option>
        </select>
        {/*Logic to add more sections for more players
        As well as a limit of 8 players and a delete option*/}
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}

export default GameCreationForm;
