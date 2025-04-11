// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Calculo from "./Calculo";
import Dashboard from "./Dashboard";
import Configuracion from "./Configuracion";
import Cotizacion from "./Cotizacion";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/equipos" element={<App />} />
      <Route path="/calculo" element={<Calculo />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="/settings" element={<Cotizacion />} />
      <Route path="/cotizacion" element={<Cotizacion />} />
    </Routes>
  </BrowserRouter>
);