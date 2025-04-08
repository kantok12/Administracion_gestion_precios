import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // 👈 Importa react-router-dom
import App from './App';  // Página de Equipos
import './index.css';  // 👈 Tailwind o tu CSS base
import Cotizar from './Cotizar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/equipos" element={<App />} />           {/* Página de Equipos */}
        <Route path="/cotizar" element={<Cotizar />} />                {/* Redireccionar cualquier otra ruta a Equipos */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);