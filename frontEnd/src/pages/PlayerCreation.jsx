import React from "react";
import PlayerCreationForm from "../components/PlayerCreationForm"

function PlayerCreation() {
  return (
    <div>
      <div>
        <h1>Player Creation</h1>
        <p>Insert Player Info</p>
      </div>
      <div><PlayerCreationForm /></div>
    </div>
  );
}

export default PlayerCreation;
