import React, { useState, useEffect } from 'react';
import { BarChart3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Definimos la interfaz para el producto, que será la misma para ambos, equipos y opcionales
interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
}

export default function Calculo() {
  // Estados para los productos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Corregido el nombre de searchTerm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // URLs de los webhooks de Equipos y Opcionales
  const WEBHOOK_EQUIPOS =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f';
  const WEBHOOK_OPCIONALES =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254';

  // Función para obtener los datos de productos (equipos y opcionales)
  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener equipos
      const resEquipos = await fetch(WEBHOOK_EQUIPOS);
      if (!resEquipos.ok) throw new Error(`Error ${resEquipos.status}`);
      const equipos: Producto[] = await resEquipos.json();

      // Obtener opcionales
      const resOpcionales = await fetch(WEBHOOK_OPCIONALES);
      if (!resOpcionales.ok) throw new Error(`Error ${resOpcionales.status}`);
      const opcionales: Producto[] = await resOpcionales.json();

      // Combinar ambos datos
      setProductos([...equipos, ...opcionales]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    [p.codigo_producto, p.nombre_del_producto, p.Descripcion, p.Modelo]
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Sistema de Precios</h1>
        </header>

        <nav className="space-y-2">
          <Link
            to="/equipos"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-5 w-5" />
            EQUIPOS
          </Link>

          <Link
            to="/opcionales"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-5 w-5" />
            Opcionales
          </Link>

          {/* Botón calculo */}
          <Link
            to="/calculo"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-5 w-5" />
            Cálculo
          </Link>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">CÁLCULO</h2>

        {/* Resumen */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold">{productosFiltrados.length}</p>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
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
            {currentProductos.length === 0 ? (
              <p className="text-gray-500 p-6">No hay productos disponibles.</p>
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
                    {currentProductos.map((p) => (
                      <tr key={p.codigo_producto} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono">{p.codigo_producto}</td>
                        <td className="px-6 py-3">{p.nombre_del_producto}</td>
                        <td className="px-6 py-3">{p.Descripcion || <span className="text-gray-400">—</span>}</td>
                        <td className="px-6 py-3">{p.Modelo || <span className="text-gray-400">—</span>}</td>
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