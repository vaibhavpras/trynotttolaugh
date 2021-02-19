import React from 'react'

import "./App.css";
import MainGameComponent from "./MainGameComponent";
import StartComponent from "./StartComponent";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/game" component={MainGameComponent} />
        <Route path="/" component={StartComponent} />
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

export default App;
