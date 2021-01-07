import React, {useEffect, useRef} from 'react'

function TestComponent() {

    const cam = useRef();

    const initCamera = async (width, height) => {
        console.log('initing camera')

        cam.current.width = width;
        cam.current.height = height;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: width,
            height: height
          }
        });
        cam.current.srcObject = stream;
        return new Promise((resolve) => {
          cam.current.onloadedmetadata = () => {
            resolve(cam);
      }});
    }

    useEffect(() => {
        const worker = new Worker('./workers/worker.js')
        worker.postMessage('Hello Worker')
        worker.onmessage = e => {
        console.log('Message received from worker:', e.data)

        initCamera(640, 480)
        .then(video => {
        console.log('Camera was initialized');
        });
    }
    }
    );

    return (
        <div>
            <video ref={cam} autoPlay muted playsInline></video>
        </div>
    )
    }


export default TestComponent