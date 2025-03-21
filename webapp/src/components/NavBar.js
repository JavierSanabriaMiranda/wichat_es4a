import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { VscAccount } from "react-icons/vsc";
import { GoSignOut } from "react-icons/go";
import i18n from "../i18n/i18next";
import { useTranslation } from "react-i18next";
import Rules from "./Rules"; 
import "./nav.css";
import logo from "../images/logo.png";

const NavBar = () => {
  const { t } = useTranslation();
  const [showRules, setShowRules] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="navbar-custom w-500">
        <Nav.Link href="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Nav.Link>
        <Container>
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-language"
                className="dropdown-language"
              >
                {t("language-menu")}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeLanguage("es")}>
                  {t("spanish-menu")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage("en")}>
                  {t("english-menu")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link href="#" className="rules-menu" onClick={() => setShowRules(true)}>
              {t("rules-menu")}
            </Nav.Link>
            <Nav.Link href="#" className="icon-menu"><VscAccount size={30} /></Nav.Link>
            <Nav.Link href="#" className="icon-menu"><GoSignOut size={30} /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Modal de reglas */}
      <Rules show={showRules} handleClose={() => setShowRules(false)} />
    </>
  );
};

export default NavBar;

