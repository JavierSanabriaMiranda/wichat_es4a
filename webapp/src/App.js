import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Home from './components/home/Home'; 

import router from './components/routers/AppRouter';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
