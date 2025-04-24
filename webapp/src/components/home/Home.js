import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";
import { ChaosButton } from "./ChaosMode";
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';
import './home.css';

/**
 * Home component that serves as the landing page of the application.
 * 
 * Features:
 * - Displays a welcome message and the app name.
 * - Offers two main gameplay options:
 *    - Quick Game: Opens a configuration panel to customize the game.
 *    - Chaos Mode: Launches a randomized game setup.
 * - Includes the navigation bar for site-wide access.
 * 
 * Configuration modal is conditionally rendered based on the state.
 * Each button is wrapped with the `GameConfigProvider` to supply game settings context.
 *
 * @returns {JSX.Element} Home screen with navigation and game options.
 */

export const Home = () => {
  const [showConfig, setShowConfig] = useState(false); // Controls visibility of configuration panel
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
        <GameConfigProvider>
          <ChaosButton />
        </GameConfigProvider>
      </div>

      {showConfig &&
        <GameConfigProvider>
          <Configuration onClose={() => setShowConfig(false)} />
        </GameConfigProvider>
      }
    </div>
  );
};
