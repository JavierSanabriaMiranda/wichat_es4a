import React, { useState } from 'react';
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
 * @returns 
 */
const Game = ({ questionTime }) => {

    const [points, setPoints] = useState(0);
    const [image, setImage] = useState("/logo512.png");
    const [question, setQuestion] = useState("¿Qué librería de desarrollo web es esta?");
    const [gameKey, setGameKey] = useState(0);
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [exitIcon, setExitIcon] = useState("/exit-icon.png");
    const [showModal, setShowModal] = useState(false);

    const onTimeUp = () => {
        // TODO
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
                <p>{question}</p>
            </div>
            <div className='div-question-img'>
                <img className="question-img" src={image} ></img>
            </div>
            <section id="question-answers-section">
                <div id="game-answer-buttons-section">
                    <AnswerButton answerText="React" isCorrectAnswer={true} />
                    <AnswerButton answerText="JQuery" isCorrectAnswer={false} />
                    <AnswerButton answerText="Angular" isCorrectAnswer={false} />
                    <AnswerButton answerText="Bootstrap" isCorrectAnswer={false} />
                </div>
            </section>
            <aside className='llm-chat-aside'>
                <LLMChat />
            </aside>
            <div className="pass-button-div">
                <button className="pass-button" onClick={passQuestion}>Siguiente</button>
                <button onClick={() => addPoints(100)}>Sumar puntos</button>
            </div>
            {/* Modal to ask the user if he really wants to exit the game */}
            <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro que deseas salir?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Si sales perderás el progreso de la partida en curso</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={exitFromGame}>
                        Salir
                    </Button>
                </Modal.Footer>
            </Modal>

        </main>
    )
}

export default Game;