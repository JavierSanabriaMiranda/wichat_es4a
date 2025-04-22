import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import ChaosMode from "./ChaosMode";
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';
import './home.css';


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
