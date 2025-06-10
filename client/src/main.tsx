import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext'; // 👈 Importa el proveedor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>         {/* 👈 Envuelve tu app aquí */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
