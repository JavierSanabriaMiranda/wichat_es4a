import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import './home.css';

const Home = () => {
  const [showConfig, setShowConfig] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="home-container">
      {/* NavBar */}
      <NavBar />

      {/* Contenido Principal */}
      <h1 className="home-heading">
        {t("welcome-home")} <span className="app-name">WiChat</span>
      </h1>
      <p className="home-subheading">{t("hello-home")}</p>
      <div className="home-buttons">
        <Button size="lg" className="game-options" onClick={() => setShowConfig(true)}>
          {t("quickGame-home")}
        </Button>
        <Button size="lg" className="game-options" onClick={() => setShowConfig(true)}>
          {t("chaosMode-home")}
        </Button>
      </div>

      {showConfig && <Configuration onClose={() => setShowConfig(false)} />}
    </div>
  );
};

export default Home;
