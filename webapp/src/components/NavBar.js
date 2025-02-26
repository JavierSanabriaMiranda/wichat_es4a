import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { VscAccount, VscArrowRight } from "react-icons/vsc";
import i18n from "../i18n/i18next";
import { useTranslation } from "react-i18next";


const NavBar = () => {
  const { t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
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
  );
};

export default NavBar;
