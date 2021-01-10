import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function TestComponent() {
  const video = useRef();
  const counter = useRef();
  var temp;
  var isStarted = false;

  const initCamera = async (width, height) => {
    console.log("initing camera");
    video.current.width = width;
    video.current.height = height;
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

  useEffect(() => {
    initCamera(320, 240).then((video) => {
      console.log("Camera was initialized");
    });

    let rand = 0;
    setInterval(() => {
      counter.current.innerHTML = rand;
      rand++;
    }, 100);
  });

  const start = () => {
    isStarted = true;
    const MODEL_URL = process.env.PUBLIC_URL + "/models";

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      console.log("started reading");
      if (!temp) {
        temp = setInterval(async () => {
          let happiness;

          try {
            const detections = await faceapi
              .detectSingleFace(
                video.current,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceExpressions();
            if (detections.expressions.hasOwnProperty("happy")) {
              happiness = detections.expressions.happy;
            }

            if (happiness > 0.7) {
              console.log("you smiled!");
            }
          } catch (e) {
            console.log(e);
          }
          // const resizedDetections = faceapi.resizeResults(detections, displaySize)
          // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          // faceapi.draw.drawDetections(canvas, resizedDetections)
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100);
      }
    });
  };

  return (
    <div>
      <h1 ref={counter}></h1>
      <button onClick={start}>start</button>
      <button
        onClick={() => {
          if (isStarted) {
            clearInterval(temp);
          }
          isStarted = false;
          temp = false
        }}
      >
        stop
      </button>
      <video ref={video} autoPlay muted playsInline></video>
    </div>
  );
}

export default TestComponent;
