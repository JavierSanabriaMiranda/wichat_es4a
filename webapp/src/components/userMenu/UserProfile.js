import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Box} from '@mui/material';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EditUser } from './EditUser';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const UserPofile = ({userName}) => {

    return (
        <Container fluid className="vh-100 w-100">
            {/* Cabecera */}
            <div className="w-100vw text-center p-3 border-bottom">
                <h4>Bienvenido/a <span className="fw-bold">{userName}</span></h4>
            </div>

            {/* Contenedor principal con sidebar y contenido */}
            <Tab.Container className="w-100vw" id="main-container" defaultActiveKey="edit">
                <Row className="w-100vw border mt-3">
                {/* Sidebar */}
                <Col sm={3} className="bg-light border-end p-3">
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="edit">Editar Perfil</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="history">Ver Historial de Partidas</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                {/* Contenido dinámico */}
                <Col sm={9} className="p-3 d-flex flex-column h-100">
                    <Tab.Content className='flex-grow-1 overflow-auto'>
                        <Tab.Pane eventKey="edit" className="w-100 h-100">
                            <EditUser userName = {userName}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="history">
                            <h5>Historial de Partidas</h5>
                            <p>Aquí se mostraría el historial...</p>
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
                </Row>
            </Tab.Container>

            {/* Botón Volver al Menú */}
            <Button size="lg" className=" position-absolute bottom-0 end-0 m-3">Volver al Menú</Button>
        </Container>
      );
}