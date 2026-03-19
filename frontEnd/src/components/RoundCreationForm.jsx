import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gameFunctions from "../api/gameFunctions";
import "./RoundCreationForm.css";

function RoundCreationForm(props) {
  const { game_info, round_info, lastRoundId } = props.RoundData;
  const [players, setPlayers] = useState([]);
  const [formFields, setFormFields] = useState({});
  const [currentRoundId, setCurrentRoundId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!game_info || !round_info) return;

    async function fetchPlayers() {
      try {
        const playerScoresAndInfo = [];

        for (const playerId of game_info.players) {
          const playerInfoRes =
            await gameFunctions.getPlayerRoundInfoFirstRound(playerId);
          const playerDetails = playerInfoRes?.player;

          let currentScore = 0;
          if (round_info.round_number > 1 && lastRoundId) {
            const scoreData = await gameFunctions.getPlayerScore(
              playerId,
              lastRoundId,
            );
            currentScore = scoreData?.score ?? scoreData ?? 0;
          }

          playerScoresAndInfo.push({
            id: playerId,
            details: playerDetails,
            score: currentScore,
          });
        }

        setPlayers(playerScoresAndInfo);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }

    fetchPlayers();
  }, [game_info, round_info, lastRoundId]);

  if (round_info && round_info.id !== currentRoundId) {
    setCurrentRoundId(round_info.id);

    if (game_info && game_info.players?.length > 0) {
      const initialFields = game_info.players.reduce(
        (acc, playerId) => {
          acc[playerId] = {
            bid: "",
            tricks_won: "",
            bonus_points: 0,
            round_score: 0,
            player_id: playerId,
          };
          return acc;
        },
        { round_id: round_info.id },
      );

      setFormFields(initialFields);
    }
  }

  const handleChange = (id, field, value) => {
    setFormFields((prev) => {
      const numericValue = value === "" ? "" : Number(value);

      return {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: numericValue,
        },
      };
    });
  };

  const submitRoundData = async () => {
    const finalSubmissionData = JSON.parse(JSON.stringify(formFields));
    const cardsDealt = round_info.round_number;

    Object.keys(finalSubmissionData).forEach((key) => {
      if (key !== "round_id") {
        const playerRecord = finalSubmissionData[key];

        const bid = playerRecord.bid === "" ? 0 : playerRecord.bid;
        const tricks_won =
          playerRecord.tricks_won === "" ? 0 : playerRecord.tricks_won;
        const bonus_points = playerRecord.bonus_points || 0;

        let score = 0;

        if (bid === 0) {
          if (tricks_won === 0) {
            score = cardsDealt * 10;
          } else {
            score = cardsDealt * -10;
          }
        } else {
          if (bid === tricks_won) {
            score = tricks_won * 20;
          } else {
            score = Math.abs(bid - tricks_won) * -10;
          }
        }

        playerRecord.round_score = score + bonus_points;
        playerRecord.bid = bid;
        playerRecord.tricks_won = tricks_won;
      }
    });

    console.log(
      "Submitting final data with official scoring:",
      finalSubmissionData,
    );

    try {
      const res = await gameFunctions.addRound(
        game_info.id,
        round_info.id,
        finalSubmissionData,
      );
      return res;
    } catch (error) {
      console.error("Failed to submit round:", error);
      return null;
    }
  };

  const handleNextRound = async (e) => {
    e.preventDefault();
    const res = await submitRoundData();

    if (res?.newRound) {
      navigate(`/round/${res.newRound.id}`, {
        state: {
          round_info: res.newRound,
          game_info,
          prev: round_info.id,
        },
      });
    }
  };

  const handleGameEnd = async (e) => {
    e.preventDefault();
    const res = await submitRoundData();

    if (res) {
      navigate(`/results/${round_info.id}`, {
        state: {
          game_info: game_info,
          final_round_id: round_info.id,
        },
      });
    }
  };

  return (
    <form className="form-container">
      <div className="form-divider">
        <table className="score-table">
          <thead>
            <tr>
              <th> Player</th>
              <th> Score</th>
              <th> Bids Needed</th>
              <th> Bids Won</th>
              <th> Bonus Points</th>
            </tr>
          </thead>
          <tbody>
            {players.map((playerObj) => {
              const id = playerObj.id;
              if (!id || !playerObj.details) return null;

              return (
                <tr key={id}>
                  <td className="player-name">
                    {playerObj.details.first_name} {playerObj.details.last_name}
                  </td>

                  <td className="score">{playerObj.score}</td>

                  <td className="bids-needed">
                    <select
                      className="select-input"
                      value={formFields[id]?.bid ?? ""}
                      onChange={(e) => handleChange(id, "bid", e.target.value)}
                    >
                      <option value="" disabled>
                        -
                      </option>
                      {[...Array(round_info.round_number + 1)].map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      className="select-input"
                      value={formFields[id]?.tricks_won ?? ""}
                      onChange={(e) =>
                        handleChange(id, "tricks_won", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        -
                      </option>
                      {[...Array(round_info.round_number + 1)].map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      className="number-input"
                      type="number"
                      value={formFields[id]?.bonus_points ?? ""}
                      onChange={(e) =>
                        handleChange(id, "bonus_points", e.target.value)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="form-btn-container-submit">
          {round_info.round_number === game_info.rounds_needed ? (
            <button type="submit" className="form-btn" onClick={handleGameEnd}>
              Finish Game
            </button>
          ) : (
            <button
              type="submit"
              className="form-btn"
              onClick={handleNextRound}
            >
              Next Round
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default RoundCreationForm;
