import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import './home.css';
import Modal from "react-bootstrap/Modal";
import { useConfig } from '../contextProviders/GameConfigProvider';

export const ChaosButton = () => {
  const { setConfig } = useConfig(); 
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const topicList = ["history", "entertainment", "art", "sport", "geography"];
  const questionOptions = [10, 20, 30];
  const timeOptions = [60, 120, 180];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
        <Modal.Header className="text-center border-0">
          <button
            type="button"
            className="btn-close white position-absolute top-0 end-0 m-3"
            aria-label="Close"
            onClick={handleCloseModal}
          />
          <Modal.Title className="w-100 d-flex justify-content-between align-items-center px-4 py-3">
            <span role="img" aria-label="bomb">🔥💣</span>
            {t("chaosMode-intro-title")}
            <span role="img" aria-label="bomb">💣🔥</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p>{t("chaosMode-intro-body")}</p>
          <p className="chaos-slogan">
            <span role="img" aria-label="random">🔀 </span>
            {t("chaosMode-slogan")}
          </p>
        </Modal.Body>

        <Modal.Footer className="justify-content-center border-0">
          <Button variant="danger" onClick={handlePlayChaos} className="chaos-btn">
            {t("playChaos")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
