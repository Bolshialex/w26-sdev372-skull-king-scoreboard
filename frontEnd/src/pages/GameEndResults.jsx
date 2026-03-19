import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gameFunctions from "../api/gameFunctions";
import "./GameEndResult.css";

function Scoreboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  const { game_info, final_round_id } = location.state || {};

  useEffect(() => {
    if (!game_info || !final_round_id) {
      navigate("/");
      return;
    }

    async function fetchFinalScores() {
      try {
        const finalResults = [];

        for (const playerId of game_info.players) {
          const playerInfoRes =
            await gameFunctions.getPlayerRoundInfoFirstRound(playerId);
          const playerDetails = playerInfoRes?.player;

          const scoreData = await gameFunctions.getPlayerScore(
            playerId,
            final_round_id,
          );
          const finalScore = scoreData?.score ?? scoreData ?? 0;

          finalResults.push({
            id: playerId,
            name: `${playerDetails?.first_name} ${playerDetails?.last_name}`,
            score: finalScore,
          });
        }

        const sortedResults = finalResults.sort((a, b) => b.score - a.score);
        setLeaderboard(sortedResults);
      } catch (error) {
        console.error("Error fetching final leaderboard:", error);
      }
    }

    fetchFinalScores();
  }, [game_info, final_round_id, navigate]);

  return (
    <div className="scoreboard-wrapper">
      <div className="card scoreboard-card">
        <h1>Captain's Ledger</h1>
        <hr className="rope-divider" />

        <table className="score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Pirate</th>
              <th>Bounty</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.id} className={index === 0 ? "winner-row" : ""}>
                <td>{index === 0 ? "1st" : `${index + 1}th`}</td>
                <td className="player-name">{player.name}</td>
                <td className="score">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="rope-divider" />

        <div className="scoreboard-actions">
          <button onClick={() => navigate("/")} className="btn btn--primary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
