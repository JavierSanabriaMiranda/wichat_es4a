import React, { useState } from 'react';
import AnswerButton from './AnswerButton';
import './game.css';

const Game = () => {

    return(
        <>
        <div id="gameTimer">
            {/* Introducir el código del timer */}
        </div>
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