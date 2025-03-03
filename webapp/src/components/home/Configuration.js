import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoXCircle } from "react-icons/go";
import { useTranslation } from "react-i18next";
import "./configuration.css";

const Configuration = ({ onClose }) => {
  const [questions, setQuestions] = useState(30);
  const [time, setTime] = useState(120);
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="overlay">
      <div className="config-container">
        <GoXCircle onClick={handleClose} className="close-icon" />
        <h2 className="title">{t("title-configuration")}</h2>
        <div className="config-option">
          <label>{t("numberQuestions-configuration")}</label>
          <Dropdown onSelect={(value) => setQuestions(Number(value))}>
            <Dropdown.Toggle variant="light">{questions}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey={10}>10</Dropdown.Item>
              <Dropdown.Item eventKey={20}>20</Dropdown.Item>
              <Dropdown.Item eventKey={30}>30</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="config-option">
          <label>{t("time-configuration")}</label>
          <Dropdown onSelect={(value) => setTime(Number(value))}>
            <Dropdown.Toggle variant="light">{time}s</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey={60}>60s</Dropdown.Item>
              <Dropdown.Item eventKey={120}>120s</Dropdown.Item>
              <Dropdown.Item eventKey={180}>180s</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="topics-section">
          <label className="topics-label">Topics</label>
          <div className="topics-container">
            <button className="topic-button purple">{t("history-configuration")}</button>
            <button className="topic-button green">{t("science-configuration")}</button>
            <button className="topic-button red">{t("art-configuration")}</button>
            <div>
              <button className="topic-button orange">{t("sport-configuration")}</button>
              <button className="topic-button blue">{t("geography-configuration")}</button>
            </div>
          </div>
        </div>
        <Button className="play-button">{t("play-configuration")}</Button>
      </div>
    </div>
  );
};

export default Configuration;
