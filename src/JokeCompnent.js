import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JokeCompnent() {
  const [jokeState, jokeStateSetter] = useState();
  var msg

  const fetchAndNarrate = () => {
    setInterval(() => {
    axios.get("https://v2.jokeapi.dev/joke/Any").then((res) => {
        console.log(res.data);
        if(res.data.type === "twopart"){
        jokeStateSetter(res.data.setup);
        if ("speechSynthesis" in window) {
          msg.text = res.data.setup;
          window.speechSynthesis.speak(msg);
        } else {
        }
        setTimeout(() => {
          jokeStateSetter(res.data.delivery);
          if ("speechSynthesis" in window) {
            msg.text = res.data.delivery;
            window.speechSynthesis.speak(msg);
          }
        }, 5000);
      }
      else if(res.data.type === "single"){
          jokeStateSetter(res.data.joke);
          if ("speechSynthesis" in window) {
              msg.text = res.data.joke;
              window.speechSynthesis.speak(msg);
            }
      }
      });}, 15000)
  }

  useEffect(() => {
    msg = new SpeechSynthesisUtterance();
    
    fetchAndNarrate()    
    
  }, []);
  return (
    <div>
      <h4>{jokeState}</h4>
    </div>
  );
}
