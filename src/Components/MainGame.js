import React, { useRef, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EmotionDetection from "./EmotionDetection";
import "../Styles/MainGame.css";
import laugh from "../Assets/laugh.png";

export default function MainGame(props) {
  const jokeTextRef = useRef(); //Reference to the card that holds our fetched jokeText
  const emotionDetectionRef = useRef(); //Reference to the EmotionDetection component
  const history = useHistory(); //To access state of the router and navigate to StartComponent
  const location = useLocation(); //Used to access the passed query param for our JoekAPI call
  const [score, setScore] = useState(0); //Contains state of score
  const [highScore, setHighScore] = useState(0); //Contains state of highScore
  const [showGameOverModal, setShowGameOverModal] = useState(false); //Used to control the display of the 'game over' modal

  //Delay between setups and between jokes
  const delay = (t) =>
    new Promise(
      (resolve) => (window.RUNNING ? setTimeout(resolve, t) : resolve) //If game is ongoing, resolve after delay, else resolve immediately (case: game ended)
    );

  //Text-to-speech
  const say = function (text) {
    jokeTextRef.current.innerHTML = text;
    return new Promise((resolve) => {
      //Return only after the whole text is narrated
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  //Fetches joke from API and handles its output to the user
  const fetchAndNarrate = async () => {
    //RUNNING is true as long as the user hasn't smiled
    while (window.RUNNING) {
      var res = await fetch(
        `https://v2.jokeapi.dev/joke/${location.state.type}?blacklistFlags=explicit`
      ); //api call
      var json = await res.json(); //parse response in json format
      //If the user's browser supports text-to-speech
      if ("speechSynthesis" in window) {
        //Returned joke has a setup and delivery
        if (json.type === "twopart") {
          if (window.RUNNING) {
            await say(json.setup);
            await delay(3000); //3s delay between setup and delivery
          } else return;
          if (window.RUNNING) {
            await say(json.delivery);
            await delay(5000); //5s delay between jokes
          } else return;
        }
        //Returned joke is one single part
        else if (json.type === "single") {
          if (window.RUNNING) {
            await say(json.joke);
            await delay(5000); //5s delay between jokes
          } else return;
        }
      }
      //If text-to-speech is not supported in user's browser, do not call say() on the response
      else {
        if (json.type === "twopart") {
          if (window.RUNNING) {
            jokeTextRef.innerHTML = json.setup;
            await delay(3000);
          } else return;
          if (window.RUNNING) {
            jokeTextRef.innerHTML = json.delivery;
            await delay(5000);
          } else return;
        } else if (json.type === "single") {
          jokeTextRef.innerHTML = json.delivery;
          await delay(5000);
        }
      }
      if (window.RUNNING) {
        setScore((prevState) => prevState + 10); //Increment score by 10 after each successful (smile-less) pass through of jokes
      } else return;
    }
  };

  //handles game over event
  const onGameOver = () => {
    setShowGameOverModal(true); //draw the game-over modal
  };

  //Handles user choice: restart game on game-over screen
  const handleRestart = () => {
    jokeTextRef.current.innerHTML = "";
    setScore(0);
    setShowGameOverModal(false);
    window.RUNNING = true;
    fetchAndNarrate();
    emotionDetectionRef.current.startEmotionDetection();
  };

  //Handles user choice: go to Home on game-over screen
  const handleGoHome = () => {
    setShowGameOverModal(false);
    history.replace({
      pathname: "/",
    });
  };

  //Start fetching after render
  useEffect(() => {
    window.RUNNING = true;
    fetchAndNarrate();
  }, []);

  //check for highscore on each score change
  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  return (
    <div className="outer-container">
      <div className="game-hud-container">
        <div className="joke-text-container">
          <text className="joke-text" ref={jokeTextRef} />
        </div>
        <div className="scores-container">
          <text className="score">Score: {score}</text>
          <text className="high-score">High Score: {highScore}</text>
        </div>
      </div>
      <EmotionDetection ref={emotionDetectionRef} onGameOver={onGameOver}/>
      <Modal
        show={showGameOverModal}
        animation="true"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-card">
          <div className="modal-header">
            <Modal.Header>
              <div className="laugh-img-container"> </div>
              <img className="laugh-img" src={laugh} alt="" />
            </Modal.Header>
          </div>
          <Modal.Body className="modal-body">
            <div className="modal-title">GOT YOU!</div>
            <div className="modal-scores">
              <div>score: {score}</div>
              <div>high score: {highScore}</div>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button className='modal-button' onClick={handleRestart}>Restart</Button>
            <Button className='modal-button' onClick={handleGoHome}>Home</Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}
