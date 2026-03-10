import React from "react";
import GameCreationForm from "../components/GameCreationForm";
import "./GameCreation.css";

function GameCreation() {
  return (
    <div className="game-creation-page">
      <div className="page-header">
        <h1>Start A New Game</h1>
      </div>
      <div>
        <h2 className="section-title">Game Settings</h2>
        <GameCreationForm />
      </div>
    </div>
  );
}

export default GameCreation;
