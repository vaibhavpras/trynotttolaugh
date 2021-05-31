import React, { useEffect, useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import * as faceapi from "face-api.js";


const EmotionDetection = forwardRef((props, ref) => { //forwardRef in order to have access to startEmotionDetection() in parent (MainGame)
  
  const video = useRef(); //Ref to <video>
  const [gameOver, setGameOver] = useState(false); //Keeps track of game-over event
  const [cantSee, setCantSee] = useState(false);  //Used to diplay warning if user's face not detected
  var intervalRef; //Reference to setInterval in startEmotionDetection()
  var isStarted = false;

  //Initalize <video> with the stream from user's camera
  const initCamera = async (width, height) => {
    video.current.width=width;
    video.current.height=height; 
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: false,
      video: {
        facingMode: "user",
        width: width,
        height: height,
      },
    });
    video.current.srcObject = stream;
    return new Promise((resolve) => {
      video.current.onloadedmetadata = () => {
        resolve(video);
      };
    });
  };

  //Keep analyzing user's face for a smile or laugh
  const startEmotionDetection = () => {
    setGameOver(false);
    isStarted = true;

    const MODEL_URL = process.env.PUBLIC_URL + "/models"; //path to model

    Promise.all([
      //Load required models
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      if (!intervalRef) { //start setInterval() only if it isn't running already
        intervalRef = setInterval(async () => { //repeat below code every 100ms
          let happiness; //used to store current happiness level on user's face
          try {
            const detections = await faceapi //detect user's emotion at the current moment
              .detectSingleFace(
                video.current, //gets input from <video> stream
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceExpressions();

              setCantSee(false);

            //if user's current emotion is happy, store the level of happiness in the variable
            if (detections.expressions.hasOwnProperty("happy")) {
              happiness = detections.expressions.happy; 
            }

            //If happiness level is > 0.7 (out of 1), it is considered as a smile or laugh for this game
            if (happiness > 0.7) {
              window.RUNNING = false; //let fetchAndNarrate() function in parent know that the user smiled and the game is over

              if (window.speechSynthesis.speaking)
                window.speechSynthesis.cancel(); //stop joke narration

              if (isStarted) {
                clearInterval(intervalRef); //clear setInterval()
              }
              isStarted = false;
              intervalRef = false;
              setGameOver(true);
            }
          } catch (e) { //catch case where the user's face or expressions cannot be detected
            setCantSee(true); //display cant's see face warning
          }
        }, 100);
      }
    })
  }

  //Passing ref of startEmtionDetecttion() to parent (MainGame)
  useImperativeHandle(ref, () => ({
    startEmotionDetection  
  }));

  //Call onGameOver handler in parent when the gameOver state is true
  useEffect(() => {
    if (gameOver){
      props.onGameOver();
    }
  }, [gameOver]);


  //Initialize <video> with camera stream on component render
  useEffect(() => {
    initCamera(320,240).then((video) => {
    });
    startEmotionDetection();
  }, []);

  return (
    <div>
      <video ref={video} autoPlay muted playsInline className="stream" style={{borderColor: `${cantSee? "red" : "#FFE263"}`}}></video>
      {cantSee ? <text className='cant-see-warning'> CAN'T SEE YOUR FACE! </text> : null}
    </div>
  );
});

const areEqual = (prevProps, nextProps) => true;

export default React.memo(EmotionDetection, areEqual);
