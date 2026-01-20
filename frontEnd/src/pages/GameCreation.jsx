import React from "react";
import GameCreationForm from "../components/GameCreationForm";

function GameCreation() {
  return (
    <div>
      <div>
        <h1>Start A New Game</h1>
      </div>
      <div>
        <p>Game Settings</p>
        <GameCreationForm />
      </div>
    </div>
  );
}

export default GameCreation;
