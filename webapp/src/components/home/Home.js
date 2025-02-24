import React, { useState } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Configuration from "./Configuration";

const Home = () => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
      {/* NavBar */}
      <Navbar bg="light" expand="lg" fixed="top" className="w-100">
        <Container>
          <Nav className="ms-auto">
            <Nav.Link href="#">Reglas</Nav.Link>
            <Nav.Link href="#">Icono</Nav.Link>
            <Nav.Link href="#">Salir</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Contenido Principal */}
      <h1 className="text-center fw-bold mt-5">Bienvenido a <span className="text-dark">WiChat</span></h1>
      <p className="text-secondary">Texto de saludo generado por IA</p>
      <div className="mt-3 d-flex flex-column gap-3">
        <Button variant="primary" size="lg" onClick={() => setShowConfig(true)}>Partida Rápida</Button>
        <Button variant="primary" size="lg">Modo Caos</Button>
      </div>

      {showConfig && <Configuration onClose={() => setShowConfig(false)} />}
    </div>
  );
};

export default Home;
