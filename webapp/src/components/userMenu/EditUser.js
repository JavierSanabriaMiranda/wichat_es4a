import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Box} from '@mui/material';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const EditUser = ({userName}) => {
    return (
        <Form >
            <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control type="email" placeholder= {userName} disabled />
                <Form.Text className="text-muted">
                    No se puede modificar el nombre de usuario.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Repetir Nueva Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" />
            </Form.Group>
            <Button className='end-0' type="submit" style={{ backgroundColor: '#FEB06A' ,borderColor: '#FEB06A',  color:"#5D6C89"}}>
                Guardar Cambios
            </Button>
        </Form>
      );
}