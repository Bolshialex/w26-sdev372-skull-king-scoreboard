import { useLocation } from "react-router-dom";

function Game() {
  const location = useLocation();
  const { round_info, game_info } = location.state;

  // console.log(round_info);
  // console.log(game_info);
  return (
    <div className="container">
      <div>
        <h1 className="title">Skull-King Counter</h1>
        <p className="title__info">
          Round {round_info.round_number} of {game_info.rounds_needed}
        </p>
      </div>
    </div>
  );
}

export default Game;
