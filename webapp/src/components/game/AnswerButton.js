import React, { useState } from 'react';

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