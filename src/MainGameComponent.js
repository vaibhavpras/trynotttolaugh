import React, { useRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import FaceRecognitionComponent from "./FaceRecognitionComponent";
import './MainGameComponent.css';

export default function MainGameComponent(props) {
  const output = useRef();

  const [score, scoreSetter] = useState(0);
  const [highScore, highScoreSetter] = useState(0);

  const location = useLocation()

  const delay = (t) =>
    new Promise((resolve) =>
      window.RUNNING ? setTimeout(resolve, t) : resolve
    );

  const say = function (text) {
    output.current.innerHTML = text;
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  const fetchAndNarrate = async () => {
    console.log(location.state.type)
    while (window.RUNNING) {
      var res = await fetch(`https://v2.jokeapi.dev/joke/${location.state.type}?blacklistFlags=explicit`);      
      var json = await res.json();
      if ("speechSynthesis" in window) {
        if (json.type === "twopart") {
          if (window.RUNNING) {
            await say(json.setup);
            await delay(3000);
          } else return;
          if (window.RUNNING) {
            await say(json.delivery);
            await delay(5000);
          } else return;
        } else if (json.type === "single") {
          if (window.RUNNING) {
            await say(json.joke);
            await delay(5000);
          } else return;
        }
      } else {
        if (json.type === "twopart") {
          if (window.RUNNING) {
            output.innerHTML = json.setup;
            await delay(3000);
          } else return;
          if (window.RUNNING) {
            output.innerHTML = json.delivery;
            await delay(5000);
          } else return;
        } else if (json.type === "single") {
          output.innerHTML = json.delivery;
          await delay(5000);
        }
      }
      if (window.RUNNING) {
        scoreSetter((prevState) => prevState + 10);
      } else return;
    }
  };

  const onGameRestart = () => {
    output.current.innerHTML = ''
    scoreSetter(0);
    window.RUNNING = true;
    fetchAndNarrate();
  };

  useEffect(() => {
    window.RUNNING = true;
    fetchAndNarrate();
  }, []);

  useEffect(() => {
    if (score > highScore) highScoreSetter(score);
  }, [score]);

  return (
    <div className='main-game-container'>
    <div className='joke-components-container'>
      <div className='joke-text-container'><text className='joke-text' ref={output}/></div>
      <div class="break"></div>
      <div className='score-container'>
      <div className='score'>Score: {score}</div>
      <div class="break"></div>
      <div className='high-score'>High Score: {highScore}</div>
      </div>
      <div class="break"></div>
    </div>
    <FaceRecognitionComponent onGameRestart={onGameRestart} score={score} highScore={highScore}></FaceRecognitionComponent>
    </div>
  );
}
