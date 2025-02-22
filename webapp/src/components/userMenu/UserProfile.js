import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box} from '@mui/material';
import './UserProfile.css';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const UserPofile = ({userName, onSelectOption}) => {


    const changeSelectedOption = (option) => {
        if (option !== 'edit' && option !== 'history') {
            console.error('Invalid option: ' + option);
        }
        onSelectOption(option);
    }

    return (
        <main className="user-profile">
            <div className="profile-header">
                Bienvenido/a <span className="username">{userName}</span>
            </div>

            <div className="profile-content">
                {/* Sidebar */}
                <div className="sidebar">
                    <button onClick={() => onSelectOption('edit')}>Editar Perfil</button>
                    <button onClick={() => onSelectOption('history')}>Historial de Partidas</button>
                </div>

                {/* Área Principal*/}
                <div className="main-area"></div>
            </div>

            <button className="back-button">Volver al Menú</button>
        </main>
      );
}