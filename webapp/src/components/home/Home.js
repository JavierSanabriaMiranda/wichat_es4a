import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { VscAccount, VscArrowRight } from "react-icons/vsc";
import Configuration from "./Configuration";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18next";

const Home = () => {
  const [showConfig, setShowConfig] = useState(false);
  const { t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
      {/* NavBar */}
      <Navbar bg="light" expand="lg" fixed="top" className="w-100">
        <Container>
          <Nav className="ms-auto">
            {/* Dropdown de idioma */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-language"
                style={{ fontSize: "20px", color: "rgb(0 0 0 / 65%)", textDecoration: "none" }}
              >
               {t("language-menu")}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeLanguage("es")}>{t("spanish-menu")}</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage("en")}>{t("english-menu")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Nav.Link href="#" style={{ fontSize: "20px" }}>{t("rules-menu")}</Nav.Link>
            <Nav.Link href="#"><VscAccount size={30} /></Nav.Link>
            <Nav.Link href="#"><VscArrowRight size={30} /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>

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
