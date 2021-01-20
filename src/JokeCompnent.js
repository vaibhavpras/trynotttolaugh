import React, { useRef, useEffect } from "react";

export default function JokeCompnent() {

  const output = useRef();

  const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

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
      if("speechSynthesis" in window){
      if (json.type === "twopart") {
        await say(json.setup);
        await delay(3000);
        if (window.RUNNING) {
          await say(json.delivery);
          await delay(5000);
        } else break;
      } else if (json.type === "single") {
        await say(json.joke);
        await delay(5000);
      }
    }
    else{
      if (json.type === "twopart") {
        output.innerHTML = json.setup
        await delay(3000);
        if (window.RUNNING) {
          output.innerHTML = json.delivery
          await delay(5000);
        } else break;
      } else if (json.type === "single") {
        output.innerHTML = json.delivery
        await delay(5000);
      }
    }
    }
  };

  useEffect(() => {
    window.RUNNING = true;
    fetchAndNarrate();
  }, []);
  
  return (
    <div>
      <div ref={output}></div>
    </div>
  );
}
