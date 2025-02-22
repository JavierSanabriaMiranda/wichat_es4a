import React, { useState } from 'react';
import AnswerButton from './AnswerButton';
import Timer from './Timer';
import LLMChat from './LLMChat';
import './game.css';

/**
 * React component that represents a wichat game with his timer, question, image, 
 * answers and chat with the LLM to ask for clues.
 * 
 * @param {Number} questionTime - The initial time in seconds to answer the question.
 * @returns 
 */
const Game = ({ questionTime }) => {

    const [points, setPoints] = useState(0);
    const [image, setImage] = useState("/logo512.png");
    const [question, setQuestion] = useState("¿Qué librería de desarrollo web es esta?");
    const [gameKey, setGameKey] = useState(0); // Add a state variable for the key

    const onTimeUp = () => {
        // TODO
     }

    const addPoints = (pointsToAdd) => {
        setPoints(points + pointsToAdd);
    }

    const passQuestion = () => {
        prepareUIForNextQuestion();
    }

    /**
     * Function that prepares the UI for the next question resetting the timer and the answer buttons.
     */
    const prepareUIForNextQuestion = () => {
        // Increment the key to force rerender
        setGameKey(prevKey => prevKey + 1); 
    }

    return (
        <main className='game-screen' key={gameKey}>
            <Timer initialTime={questionTime} onTimeUp={onTimeUp} />
            <div className='game-points'>
                {points}pts
            </div>
            <div className='game-question'>
                <p>{question}</p>
            </div>
            <div className='div-question-img'>
                <img className="question-img" src={image} ></img>
            </div>
            <section id="question-answers-section">
                <div id="game-answer-buttons-section">
                    <AnswerButton answerText="Answer 1" isCorrectAnswer={true} />
                    <AnswerButton answerText="Answer 2" isCorrectAnswer={false} />
                    <AnswerButton answerText="Answer 3" isCorrectAnswer={false} />
                    <AnswerButton answerText="Answer 4" isCorrectAnswer={false} />
                </div>
            </section>
            <aside className='llm-chat-aside'>
                <LLMChat />
            </aside>
            <div className="pass-button-div">
                <button className="pass-button" onClick={passQuestion}>Siguiente</button>
            </div>

        </main>
    )
}

export default Game;