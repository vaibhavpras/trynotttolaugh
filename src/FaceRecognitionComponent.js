import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";


function TestComponent(props) {
  const video = useRef();
  var intervalRef;
  var isStarted = false;

  const [show, setShow] = useState(false);
  const [cantSee, setCantSee] = useState(false);

  const history = useHistory();

  const initCamera = async (width, height) => {
    console.log("initing camera");
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

  const startEmotionDetection = () => {
    isStarted = true;
    const MODEL_URL = process.env.PUBLIC_URL + "/models";

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      console.log("started reading");
      if (!intervalRef) {
        intervalRef = setInterval(async () => {
          let happiness;

          try {
            const detections = await faceapi
              .detectSingleFace(
                video.current,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceExpressions();
            setCantSee(false);
            if (detections.expressions.hasOwnProperty("happy")) {
              happiness = detections.expressions.happy;
            }

            if (happiness > 0.7) {
              console.log("you smiled!");
              window.RUNNING = false;
              if (window.speechSynthesis.speaking)
                window.speechSynthesis.cancel();
              console.log("stopping detection");
              if (isStarted) {
                clearInterval(intervalRef);
              }
              isStarted = false;
              intervalRef = false;
              setShow(true);
            }
          } catch (e) {
            console.log(e);
            setCantSee(true);
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

  const handleRestart = () => {
    setShow(false);
    props.onGameRestart();
    startEmotionDetection();
  };

  const handleGoHome = () => {
    setShow(false);
    history.replace({
      pathname: "/home",
    });
  };

  useEffect(() => {
    initCamera(320,240).then((video) => {
      console.log("Camera was initialized");
    });
    startEmotionDetection();
  }, []);

  return (
    <div>
      <video ref={video} autoPlay muted playsInline className="stream" style={{borderColor: `${cantSee? "red" : "#FFE263"}`}}></video>
      {cantSee ? <div className='cant-see-warning'> <text> Can't see your face! </text></div> : null}

      <Modal
        show={show}
        animation="true"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Modal.Header className='modal-header'>
          <Modal.Title>You Lost!</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-body'>
          <div>score: {props.score}</div>
          <div>high score: {props.highScore}</div>
        </Modal.Body>
        <Modal.Footer className='modal-footer'>
          <Button onClick={handleRestart}>
            Restart
          </Button>
          <Button onClick={handleGoHome}>
            Home
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const areEqual = (prevProps, nextProps) => true;

export default React.memo(TestComponent, areEqual);
