import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Home from './components/home/Home'; 

function App() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      {/* Mostramos directamente el componente Home */}
      <Home />
    </Container>
  );
}

export default App;
