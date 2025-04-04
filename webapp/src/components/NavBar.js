import React, { useState, useContext, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Modal, Button } from "react-bootstrap";
import { VscAccount } from "react-icons/vsc";
import { GoSignOut } from "react-icons/go";
import i18n from "../i18n/i18next";
import { useTranslation } from "react-i18next";
import Rules from "./Rules";
import "./nav.css";
import { useNavigate } from 'react-router';
import AuthContext from "./contextProviders/AuthContext";


const NavBar = ({ hasPadding }) => {
  const { t } = useTranslation();

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * Hook to set the padding-top of the body when the NavBar is visible and the 
   * hasPadding prop is true.
   */
  useEffect(() => {

    if (hasPadding) {
      // Sets the padding-top of the body to the height of the navbar
      document.body.style.paddingTop = "56px";
    }
    // Clears the padding-top when the component is unmounted
    return () => {
      document.body.style.paddingTop = "0";
    };
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" fixed="top" className="navbar-custom">
        <Container fluid className="navbar-inner-container">
          <Nav.Link onClick={() => navigate("/")} className="navbar-logo">
            <img src={"/images/logo.png"} alt="Logo" className="navbar-logo" />
          </Nav.Link>

          <Nav className="ms-auto d-flex align-items-center">
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

            <Nav.Link className="rules-menu" onClick={() => setShowRules(true)}>
              {t("rules-menu")}
            </Nav.Link>

            {token ? (
              <>
                <Nav.Link onClick={() => navigate("/user")} className="icon-menu"><VscAccount size={30} /></Nav.Link>
                <Nav.Link className="icon-menu" onClick={handleLogout}><GoSignOut size={30} /></Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate("/login")} className="icon-menu">LogIn</Nav.Link>
                <Nav.Link onClick={() => navigate("/addUser")} className="icon-menu">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Rules show={showRules} handleClose={() => setShowRules(false)} />

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("logout-message")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("confirm-logout")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>{t("cancel-button")}</Button>
          <Button variant="danger" onClick={confirmLogout}>{t("confirm-button")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;


