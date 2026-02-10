import { Route, useNavigate } from "react-router-dom";

function HomeForm() {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(`/${route}`);
  };

  return (
    <>
      <div>
        <div>
          <h1>Skull-King ScoreBoard</h1>
          <p>Choose an option</p>
        </div>
        <div>
          <button onClick={() => handleClick("game")}>Start New Game</button>
          <button>Continue Game</button>
          <button onClick={() => handleClick("player/create")}>
            Create New Player
          </button>
          <button onClick={() => handleClick("players")}>Lookup Player</button>
        </div>
      </div>
    </>
  );
}

export default HomeForm;
