import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import './home.css';
import Modal from "react-bootstrap/Modal";
import { useConfig } from '../contextProviders/GameConfigProvider';


export const ChaosButton = () => {
    const { setConfig } = useConfig(); // Usamos el setConfig para guardar los datos en el contexto
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const { t } = useTranslation();
  
    const topicList = ["history", "entertainment", "art", "sport", "geography"];
    const questionOptions = [10, 20, 30];
    const timeOptions = [60, 120, 180];
  
    const handleShowModal = () => {
      setShowModal(true); 
    };
  
    const handleCloseModal = () => {
      setShowModal(false); 
    };
  
    const handlePlayChaos = () => {
      const shuffledTopics = topicList.sort(() => 0.5 - Math.random());
      const randomTopics = shuffledTopics.slice(0, Math.floor(Math.random() * topicList.length) + 1);
      const randomQuestions = questionOptions[Math.floor(Math.random() * questionOptions.length)];
      const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
  
      const chaosSettings = {
        questions: randomQuestions,
        timePerRound: randomTime,
        topics: randomTopics,
        isChaos: true
      };
  
      setConfig(chaosSettings);
  
      window.location.href = '/game';
    };
  
    return (
      <>
        <Button size="lg" className="chaos-button" onClick={handleShowModal}>
          {t("chaosMode-home")}
        </Button>
  
        {/* Modal de introducción al Modo Caos */}
        <Modal
        show={showModal}
        onHide={handleCloseModal}
        animation={false}
        centered
        contentClassName="chaos-modal-content"
      >
        <Modal.Header closeButton className="text-center border-0">
          <Modal.Title className="w-100">
            <span role="img" aria-label="bomb">💣</span>
            <span role="img" aria-label="fire">🔥</span>
            <strong> {t("chaosMode-intro-title")} </strong>
            <span role="img" aria-label="fire">🔥</span>
            <span role="img" aria-label="bomb">💣</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p>
          {t("chaosMode-intro-body")}
          </p>
          <p className="chaos-slogan">
            <span role="img" aria-label="target">🎯</span>
            <strong> {t("chaosMode-slogan")} </strong>
          </p>
        </Modal.Body>

        <Modal.Footer className="justify-content-center border-0">
          <Button variant="secondary" onClick={handleCloseModal} className="me-3 chaos-btn">
            ❌ {t("close")}
          </Button>
          <Button variant="danger" onClick={handlePlayChaos} className="chaos-btn">
            🚀 {t("playChaos")}
          </Button>
        </Modal.Footer>
      </Modal>
        
  
      </>
    );
  };