import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import "./StartComponent.css";

function StartComponent() {
  const [selectState, selectStateSetter] = useState({
    label: "Any",
    desc: "all kinds of jokes",
  });
  const history = useHistory();

  const handleSubmit = function (e) {
    e.preventDefault();
    history.replace({
      pathname: "/game",
      state: {
        type: selectState.label,
      },
    });
  };

  const handleChange = (e) => {
    switch (e.target.value) {
      case "Any":
        selectStateSetter({
          label: e.target.value,
          desc: "all kinds of jokes",
        });
        break;
      case "Programming":
        selectStateSetter({
          label: e.target.value,
          desc: "programming jokes",
        });
        break;
      case "Pun":
        selectStateSetter({ label: e.target.value, desc: "puns" });
        break;
      case "Dark":
        selectStateSetter({ label: e.target.value, desc: "dark jokes" });
        break;
    }
  };

  return (
    <div className = "outer-container"><div className="inner-container">
      <div className="card">
        <p className="title">YOU LAUGH, YOU LOSE</p>

        <div className="prompt">
          <form onSubmit={handleSubmit} id = "startForm">
            <label> I find </label>
            <select
              className="dropdown"
              value={selectState.label}
              onChange={handleChange}
              style={{ width: `${0.5 * selectState.desc.length + 0.9}em` }}>
              <option value="Any">all kinds of jokes</option>
              <option value="Programming">programming jokes</option>
              <option value="Pun">puns</option>
              <option value="Dark">dark jokes</option>
            </select>
            <label> funny. </label>
          </form>
          </div>
          <div className="submit-btn-container">
              <input form = "startForm" type="submit" value="start" className="submit-btn"></input>
            </div>
      </div>

      <div className="disclaimer">
        <p>
          Disclaimer: You need to enable your web camera to be able to play this
          game.
        </p>
        <p>
          Also note, this site does not connect to a backend server, which means
          your video feed is analyzed only inside your browser and the data
          stays only on your device.
        </p>
      </div>
    </div>
    </div>
  );
}

export default StartComponent;
