import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../context/PlayersContext";
import SearchBar from "./SearchBar";
import "./PlayerLookupList.css";

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
    <div className="player-list">
      <div className="player-list__search">
        <SearchBar
          placeholder="Search players..."
          onSearch={setSearchTerm}
          ariaLabel="Filter players by name"
        // tells SearchBar to use setSearchTerm when onSearch is called
        />
      </div>
      <div className="player-list__grid">
        {filteredPlayers.map((player) => (
          <button className="player-card" key={player.id} onClick={() => navigate(`/players/${player.id}/games`)}>
            <p className="player-card__label">Player</p>
            <p className="player-card__name">
              {player.first_name} {player.last_name}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlayerLookup;