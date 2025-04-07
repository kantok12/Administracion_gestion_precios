import React, { useState } from 'react';
import { DollarSign, BarChart3, Clock, Settings, Search } from 'lucide-react';

interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  modelo: string;
}

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const WEBHOOK_URL = 'https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f';

  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);
    setProductos([]);

    try {
      const res = await fetch(WEBHOOK_URL);

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        throw new Error('Respuesta no válida:\n' + text.slice(0, 120));
      }

      const data: Producto[] = await res.json();
      setProductos(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = busqueda.trim() === ''
    ? productos
    : productos.filter((p) => {
        const texto = `${p.codigo_producto} ${p.nombre_del_producto} ${p.Descripcion} ${p.modelo}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Sistema de Precios</h1>
        </header>

        <nav className="space-y-2">
          <button
            onClick={obtenerDatos}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-5 w-5" />
            Obtener Datos
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
            <Clock className="h-5 w-5" />
            Automation
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Resultados del Webhook</h2>

        {/* Buscador */}
        <div className="relative mb-6 w-80">
          {/* w-80 = ancho reducido */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estados */}
        {loading && (
          <div className="text-gray-600 mb-4">Cargando datos...</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-6">
            <strong>¡Error!</strong> {error}
          </div>
        )}

        {/* Resumen */}
        {!loading && !error && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-3xl font-bold">{productosFiltrados.length}</p>
            </div>
          </div>
        )}

        {/* Tabla */}
        {!loading && !error && productosFiltrados.length > 0 && (
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Modelo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productosFiltrados.map((p) => (
                  <tr key={p.codigo_producto} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono">{p.codigo_producto}</td>
                    <td className="px-6 py-3">{p.nombre_del_producto}</td>
                    <td className="px-6 py-3">{p.Descripcion || '—'}</td>
                    <td className="px-6 py-3">{p.modelo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No resultados */}
        {!loading && !error && productosFiltrados.length === 0 && (
          <p className="text-gray-500 p-6">No se encontraron resultados.</p>
        )}
      </main>
    </div>
  );
}