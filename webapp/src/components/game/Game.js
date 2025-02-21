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
    const [image, setImage] = useState(null);
    const [question, setQuestion] = useState("¿Cuál es la capital de España?");


    const onTimeUp = () => { }

    const addPoints = (pointsToAdd) => { 
        setPoints(points + pointsToAdd);
    }

    return (
        <main className='game-screen'>
            <Timer initialTime={questionTime} onTimeUp={onTimeUp} />
            <div className='game-points'>
                {points}pts
            </div>
            <div className='game-question'>
                <p>{question}</p>
            </div>
            <div className='div-question-img'>
                <img className="question-img" src="/logo512.png" ></img>
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
        </main>
    )
}

export default Game;