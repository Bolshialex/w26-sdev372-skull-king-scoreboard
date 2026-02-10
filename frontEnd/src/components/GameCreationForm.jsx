import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import gameFunctions from "../api/gameFunctions";
import { usePlayers } from "../context/PlayersContext";


function GameCreationForm() {
  const { players } = usePlayers();
  const [formFields, setFormFields] = useState([{ playerId: "" }]);
  const [playerCount, setPlayerCount] = useState(2);
  const [numRounds, setNumRounds] = useState(1);

  const handleFormChange = (e, index) => {
    const data = [...formFields];
    data[index].playerId = e.target.value;
    setFormFields(data);
  };
  const handleAddPlayer = () => {
    setPlayerCount(playerCount + 1);
    setFormFields([...formFields, { playerId: "" }]);
  };
  const handleRoundChange = (e) => {
    setNumRounds(Number(e.target.value));
  };

  const handleDeleteBtn = () => {
    setPlayerCount(playerCount - 1);
    formFields.pop();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const playersArray = [];
    formFields.map((player) => {
      playersArray.push(Number(player.playerId));
    });
    console.log({ numRounds, playersArray });
    try {
      const res = await gameFunctions.createGame({
        numRounds,
        playersArray,
      });

      console.log(res);

      if (res.message == "Game Created") {
        alert("Game Created: create player round");
      }
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="rounds">Number of Rounds</label>
        <select
          name="rounds"
          id="rounds"
          value={numRounds}
          onChange={handleRoundChange}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      {formFields.map((form, index) => (
        <div key={index}>
          <label htmlFor={`playerId-${index}`}>Player {index + 1}</label>
          <div>
            <select
              name={`playerId-${index}`}
              id={`playerId-${index}`}
              value={form.playerId}
              onChange={(e) => handleFormChange(e, index)}
            >
              <option>Select Player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.first_name + " " + player.last_name}
                </option>
              ))}
            </select>
            {index > 1 ? (
              <FaRegTrashCan className="trash-icon" onClick={handleDeleteBtn} />
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
      <div className="form-btn-container">
        {playerCount > 8 ? (
          <></>
        ) : (
          <button className="add-btn" type="button" onClick={handleAddPlayer}>
            +
          </button>
        )}
      </div>

      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}

export default GameCreationForm;
