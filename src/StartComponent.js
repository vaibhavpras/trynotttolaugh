import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import './StartComponent.css';

function StartComponent() {
  const [selectState, selectStateSetter] = useState("Any");
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
    <div className='container'>
      <div className='title'>YOU LAUGH, YOU LOSE</div>

      <div className='prompt'>
      <form onSubmit={handleSubmit}>
        <select value={selectState} onChange={handleChange} className="dropdown">
          <option value="Any">All Jokes</option>
          <option value="Programming">Programming Jokes</option>
          <option value="Pun">Puns</option>
          <option value="Dark">Dark Jokes</option>
        </select>
        <label className='label'>crack me up. </label>

        <div className='submit-container'></div><input type="submit" value="start" className='submit-btn'></input>
      </form>
      </div>
    </div>
  );
}

export default StartComponent;
