import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../context/PlayersContext";
import SearchBar from "./SearchBar";

function PlayerLookup() {
  const { players } = usePlayers();
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const filteredPlayers = players.filter((player) =>
    `${player.first_name} ${player.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div>
        <SearchBar
          placeholder="Search players..."
          onSearch={setSearchTerm}
          ariaLabel="Filter players by name"
        // tells SearchBar to use setSearchTerm when onSearch is called
        />
      </div>
      <div>
        {filteredPlayers.map((player) => (
          <button key={player.id} onClick={() => navigate(`/players/${player.id}/games`)}>
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