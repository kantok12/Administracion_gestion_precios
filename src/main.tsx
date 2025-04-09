// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Cotizar from "./Cotizar";
import Calculo from "./Calculo"; // 👈 IMPORTAR

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/equipos" element={<App />} />
      <Route path="/cotizar" element={<Cotizar />} />
      <Route path="/calculo" element={<Calculo />} /> {/* 👈 NUEVA RUTA */}
    </Routes>
  </BrowserRouter>
);