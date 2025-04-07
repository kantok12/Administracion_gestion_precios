import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  BarChart3,
  Clock,
  Settings,
  BarChart2,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom'; // 👈 Importamos Link de react-router-dom

interface Opcional {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
}

export default function Opcionales() {
  const [opcionales, setOpcionales] = useState<Opcional[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const WEBHOOK_OPCIONALES =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254'; // 🔥 Aquí pones tu URL correcta

  const obtenerOpcionales = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(WEBHOOK_OPCIONALES);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const txt = await res.text();
        throw new Error('Respuesta NO-JSON:\n' + txt.slice(0, 120));
      }
      const data: Opcional[] = await res.json();
      setOpcionales(data);
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Error al obtener los datos:', err); // Mostrar el error en la consola
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerOpcionales();
  }, []);

  const opcionalesFiltrados = opcionales.filter((o) =>
    [o.codigo_producto, o.nombre_del_producto, o.Descripcion, o.Modelo]
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOpcionales = opcionalesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(opcionalesFiltrados.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Sistema de Precios</h1>
        </header>

        <nav className="space-y-2">
          <Link
            to="/equipos"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart2 className="h-5 w-5" />
            EQUIPOS
          </Link>

          <Link
            to="/opcionales"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 font-bold text-blue-600"
          >
            <Clock className="h-5 w-5" />
            Opcionales
          </Link>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">OPCIONALES</h2>

        {/* Resumen */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold">{opcionalesFiltrados.length}</p>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar opcional..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Estados */}
        {loading && <p className="text-gray-600">Cargando…</p>}
        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {/* Tabla */}
        {!loading && !error && (
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-auto">
            {currentOpcionales.length === 0 ? (
              <p className="text-gray-500 p-6">No hay opcionales disponibles.</p>
            ) : (
              <>
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
                    {currentOpcionales.map((o) => (
                      <tr key={o.codigo_producto} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono">{o.codigo_producto}</td>
                        <td className="px-6 py-3">{o.nombre_del_producto}</td>
                        <td className="px-6 py-3">{o.Descripcion || <span className="text-gray-400">—</span>}</td>
                        <td className="px-6 py-3">{o.Modelo || <span className="text-gray-400">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>

                  <span className="text-gray-700 font-semibold">
                    {currentPage} de {totalPages}
                  </span>

                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}