import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // 👈 Importa react-router-dom
import App from './App';  // Página de Equipos
import Opcionales from './Opcionales';  // Página de Opcionales
import Calculo from './calculo';  // Página de Cálculo
import './index.css';  // 👈 Tailwind o tu CSS base

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/equipos" element={<App />} />           {/* Página de Equipos */}
        <Route path="/opcionales" element={<Opcionales />} /> {/* Página de Opcionales */}
        <Route path="/calculo" element={<Calculo />} />       {/* Página de Cálculo */}
        <Route path="*" element={<App />} />                  {/* Redireccionar cualquier otra ruta a Equipos */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);