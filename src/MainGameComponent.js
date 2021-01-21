import React, { useRef, useEffect, useState } from "react";
import TestComponent from "./TestComponent";

export default function MainGameComponent() {
  const output = useRef();

  const [score, scoreSetter] = useState(0);
  const [highScore, highScoreSetter] = useState(0);

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
    while (window.RUNNING) {
      var res = await fetch("https://v2.jokeapi.dev/joke/Any");
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
    <div>
      {/* <button
        onClick={() => {
          window.RUNNING = true;
          fetchAndNarrate();
        }}
      >Start joke</button> */}
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
      <div ref={output}></div>
      <TestComponent onGameRestart={onGameRestart}></TestComponent>
    </div>
  );
}
