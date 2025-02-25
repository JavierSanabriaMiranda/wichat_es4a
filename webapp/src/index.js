import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Game from './components/game/Game.js';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n/i18next.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const answers = [
  {
    text: "React",
    isCorrect: true
  },
  {
    text: "Angular",
    isCorrect: false
  },
  {
    text: "Vue",
    isCorrect: false
  },
  {
    text: "Svelte",
    isCorrect: false
  }
];

const question = {
  text: "¿Qué librería web es esta?",
  image: "/logo512.png"
};


root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Game questionTime={15} answers={answers} question={question}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
