import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { VscAccount, VscArrowRight } from "react-icons/vsc";
import i18n from "../i18n/i18next";
import { useTranslation } from "react-i18next";
import "./nav.css";


const NavBar = () => {
  const { t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Navbar expand="lg" fixed="top" className="navbar-custom w-100">
      <Container>
        <Nav className="ms-auto">
          {/* Dropdown de idioma */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-language"
              className="dropdown-language"
            >
              {t("language-menu")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeLanguage("es")}>{t("spanish-menu")}</Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage("en")}>{t("english-menu")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link href="#" className="rules-menu">{t("rules-menu")}</Nav.Link>
          <Nav.Link href="#" className="icon-menu"><VscAccount size={30} /></Nav.Link>
          <Nav.Link href="#" className="icon-menu"><VscArrowRight size={30} /></Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
