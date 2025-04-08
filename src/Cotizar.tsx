// Archivo: src/App.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DollarSign, BarChart2, Clock, Search } from "lucide-react";

// Interfaces
interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
  categoria?: string;
}

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const WEBHOOK_URL_PRINCIPAL =
    "https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f";

  const obtenerDatos = async () => {
    try {
      const res = await fetch(WEBHOOK_URL_PRINCIPAL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Producto[] = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    [p.codigo_producto, p.nombre_del_producto, p.Descripcion]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold leading-5">Sistema de<br />Precios</h1>
        </header>
        <nav className="space-y-2">
          <Link to="/equipos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <BarChart2 className="h-5 w-5" />
            EQUIPOS
          </Link>
          <Link to="/cotizar" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <Clock className="h-5 w-5" />
            COTIZAR
          </Link>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Cotizacion</h2>

        {/* Search bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="w-24 p-4 text-left">Código</th>
                <th className="w-1/4 p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosFiltrados.map((p) => (
                <tr key={p.codigo_producto} className="hover:bg-gray-50">
                  <td className="p-4 font-mono">{p.codigo_producto}</td>
                  <td className="p-4">{p.nombre_del_producto}</td>
                  <td className="p-4">{p.Descripcion}</td>
                </tr>
              ))}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}