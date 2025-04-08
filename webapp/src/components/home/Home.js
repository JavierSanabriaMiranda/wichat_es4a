import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import { GameConfigProvider, useConfig } from '../contextProviders/GameConfigProvider';
import './home.css';
import { useNavigate } from "react-router";

const ChaosButton = () => {
  const { setConfig } = useConfig(); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  const topicList = ["history", "entertainment", "art", "sport", "geography"];
  const questionOptions = [10, 20, 30];
  const timeOptions = [60, 120, 180];

  const handleChaosMode = () => {
    const shuffledTopics = topicList.sort(() => 0.5 - Math.random());
    const randomTopics = shuffledTopics.slice(0, Math.floor(Math.random() * topicList.length) + 1);
    const randomQuestions = questionOptions[Math.floor(Math.random() * questionOptions.length)];
    const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];

    const chaosSettings = {
      questions: randomQuestions,
      timePerRound: randomTime,
      topics: randomTopics
    };

    setConfig(chaosSettings);

    navigate('/game', { state: { questionTime: randomTime } });
  };


  return (
    <Button size="lg" className="game-options" onClick={handleChaosMode}>
      {t("chaosMode-home")}
    </Button>
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
