import { React, useState } from "react";
import { useHistory } from "react-router-dom";

function StartComponent() {
  const [selectState, selectStateSetter] = useState("");
  const history = useHistory();

  const handleSubmit = function (e) {
    e.preventDefault();
    history.replace({
      pathname: "/game",
      state: {
        type: selectState,
      },
    });
  };
  
  const handleChange = (e) => {
    selectStateSetter(e.target.value);
  };

  return (
    <div>
      <div>YOU LAUGH YOU LOSE</div>
      <label for="type">Pick your posion</label>
      <form onSubmit={handleSubmit}>
        <select value={selectState} onChange={handleChange} id="dropdown">
          <option value="Any">Any</option>
          <option value="Programming">Programming</option>
          <option value="Pun">Pun</option>
          <option value="Dark">Dark</option>
        </select>

        <input type="submit" value="start"></input>
      </form>
    </div>
  );
}

export default StartComponent;
