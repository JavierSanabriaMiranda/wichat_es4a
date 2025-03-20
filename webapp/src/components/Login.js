// src/components/Login.js
import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import AuthContext from './contextProviders/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { login, error } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const loginUser = async () => {
    await login(username, password);

    if (error) {
      setErrorMsg(error);
      return;
    }
    setOpenSnackbar(true);

    setTimeout(() => {
      navigate('/');;
    }
    , 1000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
        <div>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={loginUser}>
            Login
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={t('login-success')} />
          {error && (
            <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')} message={`Error: ${errorMsg}`} />
          )}
        </div>
    </Container>
  );
};
