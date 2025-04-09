import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';
import './home.css';
import Modal from "react-bootstrap/Modal";
import { useConfig } from '../contextProviders/GameConfigProvider';

const ChaosButton = () => {
  const { setConfig } = useConfig(); // Usamos el setConfig para guardar los datos en el contexto
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const { t } = useTranslation();

  const topicList = ["history", "entertainment", "art", "sport", "geography"];
  const questionOptions = [10, 20, 30];
  const timeOptions = [60, 120, 180];

  const handleShowModal = () => {
    setShowModal(true); // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  const handlePlayChaos = () => {
    // Generar datos aleatorios
    const shuffledTopics = topicList.sort(() => 0.5 - Math.random());
    const randomTopics = shuffledTopics.slice(0, Math.floor(Math.random() * topicList.length) + 1);
    const randomQuestions = questionOptions[Math.floor(Math.random() * questionOptions.length)];
    const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];

    // Configuración para el modo caos
    const chaosSettings = {
      questions: randomQuestions,
      timePerRound: randomTime,
      topics: randomTopics,
      isChaos: true
    };

    // Guardamos la configuración en el contexto
    setConfig(chaosSettings);

    // Ahora, redirigimos al juego
    window.location.href = '/game';
  };

  return (
    <>
      <Button size="lg" className="chaos-button" onClick={handleShowModal}>
        {t("chaosMode-home")}
      </Button>

      {/* Modal de introducción al Modo Caos */}
      <Modal show={showModal} onHide={handleCloseModal} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("chaosMode-intro-title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("chaosMode-intro-body")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("close")}
          </Button>
          <Button 
            variant="danger" 
            onClick={handlePlayChaos} 
          >
            {t("playChaos")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const Home = () => {
  const [showConfig, setShowConfig] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <NavBar />
      <h1 className="home-heading">
        {t("welcome-home")} <span className="app-name">WiChat</span>
      </h1>

      <div className="home-buttons">
        <Button size="lg" className="game-options" onClick={() => setShowConfig(true)}>
          {t("quickGame-home")}
        </Button>
        <GameConfigProvider key={Date.now()}>
          <ChaosButton />
        </GameConfigProvider>
      </div>

      {showConfig &&
        <GameConfigProvider key={Date.now()}>
          <Configuration onClose={() => setShowConfig(false)} />
        </GameConfigProvider>
      }
    </div>
  );
};
