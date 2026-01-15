import { useState } from "react";
import playerFunctions from "../api/playerFunctions";

function PlayerCreationForm() {
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormFields((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await playerFunctions.createPlayer(formFields);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div>
      <form className="game-form" onSubmit={handleSubmit}>
        <div className="form-sub-container">
          <label className="form-label" htmlFor="first_name">
            First Name
          </label>
          <input
            className="form-input"
            name="first_name"
            id="first_name"
            value={formFields.first_name}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div className="form-sub-container">
          <label className="form-label" htmlFor="last_name">
            Last Name
          </label>
          <input
            className="form-input"
            name="last_name"
            id="last_name"
            value={formFields.last_name}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="form-btn-container-submit">
          <button className="form-btn">Create Player</button>
        </div>
      </form>
    </div>
  )
}

export default PlayerCreationForm;