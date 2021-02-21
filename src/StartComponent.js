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
    <div className='outer-container'>

      <div className='title'>YOU LAUGH, YOU LOSE</div>

      <div className='prompt'>

      <form onSubmit={handleSubmit}>

        <select className="dropdown" value={selectState} onChange={handleChange} >
          <option value="Any">All Jokes</option>
          <option value="Programming">Programming Jokes</option>
          <option value="Pun">Puns</option>
          <option value="Dark">Dark Jokes</option>
        </select>

        <label className='label'>are kind of funny. </label>

        <div className='submit-btn-container'><input type="submit" value="start" className='submit-btn'></input></div>

      </form>

      </div>

      <div className='disclaimer'>
      <p>Disclaimer: You need to enable your web camera to be able to play this game.</p>
      <p>Also note, this site does not connect to a backed server, which means your video feed is analyzed only inside your browser and the data stays only on your device. </p>
      </div>

    </div>
  );
}

export default StartComponent;
