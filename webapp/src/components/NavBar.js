import React from "react";
import { useContext } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { VscAccount } from "react-icons/vsc";
import { GoSignOut } from "react-icons/go";
import i18n from "../i18n/i18next";
import { useTranslation } from "react-i18next";
import "./nav.css";
import AuthContext from "./contextProviders/AuthContext";


const NavBar = () => {
  const { t } = useTranslation();

  const { token } = useContext(AuthContext);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Navbar expand="lg" fixed="top" className="navbar-custom w-100">
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
              <Dropdown.Item className="language-options" onClick={() => changeLanguage("es")}>{t("spanish-menu")}</Dropdown.Item>
              <Dropdown.Item className="language-options" onClick={() => changeLanguage("en")}>{t("english-menu")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link href="#" className="rules-menu">{t("rules-menu")}</Nav.Link>
          {token ?
            (<>
              <Nav.Link href="/user" className="icon-menu"><VscAccount size={30} /></Nav.Link>
              <Nav.Link href="#" className="icon-menu"><GoSignOut size={30} /></Nav.Link>
            </>) 
            : 
            (<>
              <Nav.Link href="/login" className="icon-menu">LogIn</Nav.Link>
              <Nav.Link href="/addUser" className="icon-menu">Sign Up</Nav.Link>
            </>)}

        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
