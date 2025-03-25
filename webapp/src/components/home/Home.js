import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import { GameConfigProvider } from '../game/GameConfigProvider';
import './home.css';
import { welcome } from '../../services/LLMService';
import { Typewriter } from "react-simple-typewriter";

export const Home = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [greeting, setGreeting] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    /**
     * Fetches a greeting message for the user based on their name and language.
     * 
     * @async
     * @function fetchGreeting
     * @throws Will throw an error if the greeting could not be fetched.
     * 
     * @example
     * fetchGreeting();
     */
    const fetchGreeting = async () => {
      try {
        const storedUsername = sessionStorage.getItem('username') || "";
        const response = await welcome({ name: storedUsername, language: i18n.language });
        setGreeting(response.data.answer);
      } catch (error) {
        console.error("Error al obtener saludo:", error);
        setGreeting(t("hello-home"));
      }
    };

    fetchGreeting();
  }, [i18n.language, t]); // Esto se vuelve a ejecutar cada vez que cambia el idioma


  return (
    <div className="home-container">
      {/* NavBar */}
      <NavBar />

      {/* Contenido Principal */}
      <h1 className="home-heading">
        {t("welcome-home")} <span className="app-name">WiChat</span>
      </h1>
      {greeting !== null && (
        <p className="home-subheading">
          <Typewriter
            key={`typewriter-${greeting}`}
            words={[greeting, "~ Powered By ~", "👩 Claudia, 👨 Javier, 👩 Adriana, 👩 Ana, 👩 Andrea, 👨 Aitor"]}
            cursor
            cursorStyle="|"
            typeSpeed={50}
          />
        </p>
      )}
      <div className="home-buttons">
        <Button size="lg" className="game-options" onClick={() => setShowConfig(true)}>
          {t("quickGame-home")}
        </Button>
        <Button size="lg" className="game-options" onClick={() => setShowConfig(true)}>
          {t("chaosMode-home")}
        </Button>
      </div>

      {showConfig &&
        <GameConfigProvider key={Date.now()}> {/* Key to force re-render and configurate again */}
          <Configuration onClose={() => setShowConfig(false)} />
        </GameConfigProvider>
      }
    </div>
  );
};