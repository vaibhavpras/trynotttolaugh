
<br />
<p align="center">
  <a href="https://github.com/vaibhavpras/youlaughyoulose/">
    <img src="https://raw.githubusercontent.com/vaibhavpras/youlaughyoulose/main/src/Assets/laugh.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">You Laugh, You Lose!</h3>

  <p align="center">
  <a href="https://youlaughyoulose.netlify.app/">youlaughyoulose.netlify.app</a>
  </p>
</p>





## About The Project

You Laugh, You Lose! is a web-based game where your objective is to not laugh at the displayed jokes and achieve a high score. The game makes use of the user's camera to continuously analyze their facial expressions and the game ends when a smile or laugh is detected. All of the emotion detection is handled entirely within the user's browser using Tensorflow.js. 

## Built With


* [ReactJS](https://reactjs.org/)
* [Joke API v2](https://sv443.net/jokeapi/v2/)
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
* [Face-API.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) which is an implementation of [Tensorflow.js](https://www.tensorflow.org/js)
* [Netlify](https://netlify.com)


## Getting Started



### Prerequisites

* [Node Package Manager](https://nodejs.org/en/)
* [Create-React-App](https://github.com/facebook/create-react-app)
* [Face-API.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
 
### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/vaibhavpras/youlaughyoulose
   ```
2. Navigate to the project directory
   ```sh
   cd youlaughyoulose
   ```
3. Install node packages
   ```sh
   npm install
   ```
4. To serve your app to your `localhost`, enter the following in the project directory:
   ```sh
    npm start 
   ```


## Usage

Demo can be found at: [https://youlaughyoulose.netlify.app/](https://youlaughyoulose.netlify.app/)

Select any of the four types of jokes and click start. It might take a while for the face-detection models to load depending on the specs of your device. Once loaded, make sure your face is aligned on the camera stream and that you are in a well lit area. As soon as the game detects a smile or a laugh on your face, you will be taken to the game-over screen where you can choose to restart game or go to the home page.

## Planned features
- Add multiplayer capabilities so that a group of around 5 can join a room and participate simultaneously.
- Add more sources of funny content 

## License
Distributed under the MIT License. 

