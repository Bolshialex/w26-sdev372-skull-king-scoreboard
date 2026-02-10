import { useState } from "react";
import playerFunctions from "../api/playerFunctions";
import { usePlayers } from "../context/PlayersContext";

function PlayerCreationForm() {
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
  });

  const {refreshPlayers } = usePlayers();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormFields((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await playerFunctions.createPlayer(formFields);
      await refreshPlayers();
      setMessage(`Player profile for ${formFields.first_name} ${formFields.last_name} created successfully!`);
      setFormFields({ first_name: "", last_name: "" });
    } catch (error) {
      console.error("Error creating player:", error);
      setMessage(`Failed to create player ${formFields.first_name} ${formFields.last_name}. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            name="first_name"
            id="first_name"
            value={formFields.first_name}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            name="last_name"
            id="last_name"
            value={formFields.last_name}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div>
          <button disabled={loading}>{loading ? 'Creating player...' : 'Create Player'}</button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default PlayerCreationForm;
