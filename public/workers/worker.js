this.onmessage = (e) => {
  console.log("Message from worker.js");
  this.postMessage('Hello Main')  
} 
