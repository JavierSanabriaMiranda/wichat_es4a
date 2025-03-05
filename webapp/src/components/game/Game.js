import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnswerButton from './AnswerButton';
import Timer from './Timer';
import LLMChat from './LLMChat';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './game.css';
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * React component that represents a wichat game with his timer, question, image, 
 * answers and chat with the LLM to ask for clues.
 * 
 * @param {Number} questionTime - The initial time in seconds to answer the question.
 * @param {Array} answers - The array of answers with the text and if it is the correct answer.
 * @param {Object} question - The object with the question and the image.
 * @returns the hole game screen with the timer, question, image, answers and chat with the LLM.
 */
const Game = ({ questionTime, answers, question }) => {

    const { t } = useTranslation();

    const [points, setPoints] = useState(0);
    const [gameKey, setGameKey] = useState(0);
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [notAnswered, setNotAnswered] = useState(0);
    const [exitIcon, setExitIcon] = useState("/exit-icon.png");
    const [showModal, setShowModal] = useState(false);
    // State that stores the results of the questions with json format
    // with attributes: topic, imageUrl, wasUserCorrect and answers (an array of objects with text and isCorrect)
    const [questionResults, setQuestionResults] = useState([]);

    const onTimeUp = () => {
        // TODO
    }

    /**
     * Function that handles the user answer to the question.
     * 
     * @param {boolean} wasUserCorrect - True if the user was correct, false otherwise.
     */
    const answerQuestion = (wasUserCorrect) => {
        if (wasUserCorrect) {
            addPoints(100);
            setCorrectAnswers(correctAnswers + 1);
        }
        else {
            setWrongAnswers(wrongAnswers + 1);
        }
        addQuestionResult(wasUserCorrect);
        prepareUIForNextQuestion();
    }

    /**
     * Function that adds the result of the question to the questionResults state.
     * 
     * @param {boolean} wasUserCorrect - True if the user was correct, false otherwise.
     */
    const addQuestionResult = (wasUserCorrect) => {
        setQuestionResults([...questionResults, {
            "topic": question.topic,
            "imageUrl": question.imageUrl,
            "wasUserCorrect": wasUserCorrect,
            "answers": answers.map(answer => ({ "text": answer.text, "isCorrect": answer.isCorrect }))
        }]);
    }

    /**
     * Function that adds points to the user and animates the points to add.
     * 
     * @param {Number} pointsToAdd 
     */
    const addPoints = (pointsToAdd) => {
        setPointsToAdd(pointsToAdd);
        setPoints(points + pointsToAdd);
        setTimeout(() => setPointsToAdd(0), 1000); // Remove points to add animation after 1 second
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

    /**
     * Function that asks the user if he really wants to exit the game.
     */
    const askExitGame = () => {
        setShowModal(true);
    }

    /**
     * Function that handles the close of the modal
     */
    const handleCloseModal = () => {
        setShowModal(false);
    };

    /**
     * Function that exits the game without saving the progress.
     */
    const exitFromGame = () => {
        // TODO
    }

    return (
        <main className='game-screen' key={gameKey}>
            <div className='timer-div'>
                <Timer initialTime={questionTime} onTimeUp={onTimeUp} />
            </div>
            <div className='game-points-and-exit-div'>
                {pointsToAdd > 0 && <div className='points-to-add'>+{pointsToAdd}</div>}
                <div className={points < 1000 ? 'points-div-under-1000' : 'points-div-above-1000'}>{points}pts</div>
                <button
                    onClick={askExitGame}
                    className="exit-button"
                    onMouseEnter={() => setExitIcon("/red-exit-icon.png")}
                    onMouseLeave={() => setExitIcon("/exit-icon.png")}
                >
                    <img src={exitIcon} className='exit-icon' alt='exit-button' />
                </button>
            </div>
            <div className='game-question'>
                <p>{question.text}</p>
            </div>
            <div className='div-question-img'>
                <img className="question-img" src={question.image} ></img>
            </div>
            <section id="question-answers-section">
                <div id="game-answer-buttons-section">
                    { /* Create the answerButtons */}
                    { /* Uses key to help React renderizing */}
                    {answers.map((answer, index) => (
                        <AnswerButton
                            key={index}
                            answerText={answer.text}
                            isCorrectAnswer={answer.isCorrect}
                            answerAction={answerQuestion}
                        />
                    ))}

                </div>
            </section>
            <aside className='llm-chat-aside'>
                <LLMChat />
            </aside>
            <div className="pass-button-div">
                <button className="pass-button" onClick={passQuestion}>{t('pass-button-text')}</button>
            </div>
            {/* Modal to ask the user if he really wants to exit the game */}
            <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('exit-confirm-msg-title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('exit-confirm-msg-body')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        {t('exit-confirm-msg-close')}
                    </Button>
                    <Button variant="danger" onClick={exitFromGame}>
                        {t('exit-confirm-msg-exit')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    )
}

export default Game;