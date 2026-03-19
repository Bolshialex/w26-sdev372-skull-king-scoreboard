import { useLocation, useNavigate } from "react-router-dom";
import RoundCreationForm from "../components/RoundCreationForm";

function Round() {
  const location = useLocation();
  const navigate = useNavigate();
  const round_info = location.state?.round_info;
  const game_info = location.state?.game_info;
  const lastRoundId = location.state?.prev;
  if (!round_info || !game_info) {
    return (
      <div className="container">
        <h1 className="title">Skull-King Counter</h1>
        <p className="title__info">No game data available.</p>
        <p>
          Please create a game first or navigate from the Game Creation page.
        </p>
        <div style={{ marginTop: 16 }}>
          <button
            className="btn btn--primary"
            onClick={() => navigate("/game")}
          >
            Go to Game Creation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <h1 className="title">Skull-King Counter</h1>
        <p className="title__info">
          Round {round_info.round_number} of {game_info.rounds_needed}
        </p>
      </div>
      <RoundCreationForm RoundData={{ game_info, round_info, lastRoundId }} />
    </div>
  );
}

export default Round;
