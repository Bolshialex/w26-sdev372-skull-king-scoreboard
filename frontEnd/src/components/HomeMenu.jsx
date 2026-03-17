import { useNavigate } from "react-router-dom";
import "./HomeMenu.css";

function HomeForm() {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(`/${route}`);
  };

  return (
    <div className="home-menu">
      <h1>Skull-King ScoreBoard</h1>
      <p>Choose an option</p>
      <div className="home-menu__nav">
        <button className="btn" onClick={() => handleClick("game")}>Start New Game</button>
        <button className="btn">Continue Game</button>
        <button className="btn" onClick={() => handleClick("player/create")}>
          Create New Player
        </button>
        <button className="btn" onClick={() => handleClick("players")}>Lookup Player</button>
      </div>
    </div>
  );
}

export default HomeForm;
