import React from "react";
import PlayerLookupList from '../components/PlayerLookupList';
import "./PlayerLookup.css";

function PlayerLookup() {
  return (
    <div className="player-lookup-page">
      <div className="page-header">
        <h1>All Players</h1>
      </div>
      <PlayerLookupList />
    </div>
  );
}

export default PlayerLookup;
