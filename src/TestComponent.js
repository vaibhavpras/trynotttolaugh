import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function TestComponent(props) {
  const video = useRef();
  var intervalRef;
  var isStarted = false;

  const [show, setShow] = useState(false);

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

    
          setShow(false)
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
            setShow(true)

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

  const handleModalClose = () => {
    setShow(false);
    props.onGameRestart();
    startEmotionDetection();
  };

  useEffect(() => {
    initCamera(320, 240).then((video) => {
      console.log("Camera was initialized");
    });
    startEmotionDetection();
  }, []);

  return (
    <div>
      <video ref={video} autoPlay muted playsInline></video>

      <Modal
        show={show}
        onHide={handleModalClose}
        backdrop="static"
        animation="true"
        style={{ width: "100VW", height: "100VH" }}
      >
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Restart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const areEqual = (prevProps, nextProps) => true;

export default React.memo(TestComponent, areEqual);
