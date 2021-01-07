
this.onmessage = (e) => {
  console.log("message in worker.js");
  this.postMessage('camera inited in worker')

  //initCamera(640, 480).then(_ => console.log('camera initialized in worker'));
 
   
};
