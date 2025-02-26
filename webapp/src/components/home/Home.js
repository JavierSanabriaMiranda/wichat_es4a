import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar";

const Home = () => {
  const [showConfig, setShowConfig] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
      {/* NavBar */}
      <NavBar />

      {/* Contenido Principal */}
      <h1 className="text-center fw-bold mt-5">
        {t("welcome-home")} <span className="text-dark">WiChat</span>
      </h1>
      <p className="text-secondary">{t("hello-home")}</p>
      <div className="mt-3 d-flex flex-column gap-3">
        <Button variant="primary" size="lg" onClick={() => setShowConfig(true)}>
          {t("quickGame-home")}
        </Button>
        <Button variant="primary" size="lg">{t("chaosMode-home")}</Button>
      </div>

      {showConfig && <Configuration onClose={() => setShowConfig(false)} />}
    </div>
  );
};

export default Home;
