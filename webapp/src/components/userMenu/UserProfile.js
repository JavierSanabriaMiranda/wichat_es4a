import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box} from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const UserPofile = ({userName, onSelectOption}) => {

    const changeSelectedOption = (option) => {
        onSelectOption(option);
    }

    return (
        <Container>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bienvenido/a {userName}
          </Typography>
    
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" onClick={() => onSelectOption('edit')}>
              Editar Perfil
            </Button>
            <Button variant="contained" onClick={() => onSelectOption('history')}>
              Historial de Partidas
            </Button>
          </Box>
    
          <Button variant="outlined" sx={{ mt: 3 }}>
            Volver al Menú
          </Button>
        </Container>
      );
}