import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./rules.css";

const Rules = ({ show, handleClose }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className = "close-icon-rules">
        <Modal.Title>{t("rules-title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t("rules-content-1")}</p>
        <p>{t("rules-content-2")}</p>
        <p>{t("rules-content-3")}</p>
      </Modal.Body>
    </Modal>
  );
};

export default Rules;