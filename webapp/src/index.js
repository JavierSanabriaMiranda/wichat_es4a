import React from 'react';
import i18n from './i18n/i18next.js';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Game from './components/game/Game.js';
import reportWebVitals from './reportWebVitals';
import { UserPofile } from './components/userMenu/UserProfile';
import { GameResults } from './components/game/GameResults.js';


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
    {/*<App /> */}
    {/* <UserPofile userName={"uo294420"}/>*/}
    <GameResults questions={[question]} points={100} numOfCorrectAnswers={12} numOfWrongAnswers={3} numOfNotAnswered={6} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
