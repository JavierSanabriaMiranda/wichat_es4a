import React, { useState } from 'react';
import AnswerButton from './AnswerButton';
import Timer from './Timer';
import './game.css';

/**
 * React component that represents a wichat game with his timer, question, image, 
 * answers and chat with the LLM to ask for clues.
 * 
 * @param {Number} questionTime - The initial time in seconds to answer the question.
 * @returns 
 */
const Game = ({questionTime}) => {

    const ontTimeUp = () => {}

    return(
        <>
        <Timer initialTime={questionTime} onTimeUp={ontTimeUp} />
        <section>
            <div id="game-answer-buttons-section">
                <AnswerButton answerText="Answer 1" isCorrectAnswer={true} />
                <AnswerButton answerText="Answer 2" isCorrectAnswer={false} />
                <AnswerButton answerText="Answer 3" isCorrectAnswer={false} />
                <AnswerButton answerText="Answer 4" isCorrectAnswer={false} />
            </div>
        </section>
        <aside>
            { /* Sección del chat con el LLM */ }
        </aside>
        </>
    )
}

export default Game;