import React, { useState } from 'react';

/**
 * React component to represent an answer in the game that can be wrong or correct.
 * @param {String} answerText - The text of the answer.
 * @param {Boolean} isCorrectAnswer - A flag to indicate if the answer is correct or not.
 * @returns A button with the answer text that changes its style when it is clicked.
 */
const AnswerButton = ({answerText, isCorrectAnswer}) => {

    const [wasSelected, setWasSelected] = useState(false);

    const buttonClassName = wasSelected ?
        (isCorrectAnswer ? "answer-button-correct-answer" : "answer-button-wrong-answer")
        : "answer-button not-answered";

    const handleClick = () => {
        setWasSelected(true);
        console.log(`${buttonClassName}`);
    }

    return (
        <button onClick={handleClick} className={buttonClassName} >
            {answerText}
        </button>
    )
}

export default AnswerButton;