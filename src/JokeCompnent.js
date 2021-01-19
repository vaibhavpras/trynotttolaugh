import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JokeCompnent() {
  const [jokeState, jokeStateSetter] = useState();

  const fetchAndNarrate = () => {
    axios.get("https://v2.jokeapi.dev/joke/Any").then((res) => {
      console.log(res.data);
      //the returned joke is twopart ie. with a setup and a delivery
      if (res.data.type === "twopart") {
        jokeStateSetter(res.data.setup);
        //If speech synthesis compatible
        if ("speechSynthesis" in window) {
          say(res.data.setup).then(() => {
            setTimeout(() => {
              jokeStateSetter(res.data.delivery);
              if ("speechSynthesis" in window) {
                say(res.data.delivery).then(() => {
                  setTimeout(() => {
                    fetchAndNarrate();
                  }, 4000);
                });
              }
            }, 2000);
          });
        //If speech synthesis not compatible
        } else {
          setTimeout(() => {
            jokeStateSetter(res.data.delivery);
          }, 4000);
          fetchAndNarrate();
        }
      //the returned joke is in a single sentence
      } else if (res.data.type === "single") {
        jokeStateSetter(res.data.joke);
        //If speech synthesis compatible
        if ("speechSynthesis" in window) {
          say(res.data.joke).then(() => {
            setTimeout(() => {
              fetchAndNarrate();
            }, 4000);
          });
        } 
        //If speech synthesis compatible
        else {
          setTimeout(() => {
            jokeStateSetter(res.data.delivery);
          }, 4000);
          fetchAndNarrate();
        }
      }
      //the returned joke is of neither type
      else {
        fetchAndNarrate();
      }
    });
  };

  const say = function (text) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    fetchAndNarrate();
  }, []);
  return (
    <div>
      <h4>{jokeState}</h4>
    </div>
  );
}
