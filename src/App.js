import React from 'react'
import MainGame from "./Components/MainGame.js";
import Home from "./Components/Home.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";

/**
 * TODO:
 * x fix scroll issue on mobile
 * - fix stream border issue on mobile
 * - fix image loading late issue
 * - fix home screen ui  
 * - add message to cant see warning
 * - implement loading model screen
 */

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/game" component={MainGame} />
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
