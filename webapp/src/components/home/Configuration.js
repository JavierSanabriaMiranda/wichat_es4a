import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoXCircle } from "react-icons/go";
import { useTranslation } from "react-i18next";
import "./configuration.css";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

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

          <ToggleButtonGroup type="checkbox" defaultValue={[1, 3]} className="buttonGroup">
          <ToggleButton id="history" value={1} className="toggle-btn-history">
            Historia
          </ToggleButton>
          <ToggleButton id="science" value={2} className="toggle-btn-science">
            Ciencia
          </ToggleButton>
          <ToggleButton id="art" value={3} className="toggle-btn-art">
            Arte
          </ToggleButton>
          <br />
          <ToggleButton id="sport" value={1} className="toggle-btn-sport">
            Deportes
          </ToggleButton>
          <ToggleButton id="geography" value={2} className="toggle-btn-geography">
            Geografía
          </ToggleButton>
          </ToggleButtonGroup>

        </div>
        <Button className="play-button">{t("play-configuration")}</Button>
      </div>
    </div>
  );
};

export default Configuration;
