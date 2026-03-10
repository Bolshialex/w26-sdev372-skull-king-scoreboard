import React from "react";
import PlayerCreationForm from "../components/PlayerCreationForm"
import "./PlayerCreation.css";

function PlayerCreation() {
  return (
    <div className="player-creation-page">
      <div className="page-header">
        <h1>Player Creation</h1>
        <p>Insert Player Info</p>
      </div>
      <PlayerCreationForm />
    </div>
  );
}

export default PlayerCreation;
