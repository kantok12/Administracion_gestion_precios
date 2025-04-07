import React, { useState, useEffect } from 'react';
import { BarChart3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Definimos la interfaz para el producto (equipos y opcionales)
interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
}

export default function Calculo() {
  const [productos, setProductos] = useState<Producto[]>([]); // Equipos y opcionales combinados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [opcionalesDelModelo, setOpcionalesDelModelo] = useState<Producto[]>([]); // Opcionales para el modelo seleccionado
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

  // Filtrar solo los equipos principales
  const equiposPrincipales = productos.filter(
    (producto) => !producto.Modelo.includes('opcionales') // Filtra solo equipos sin la palabra 'opcionales'
  );

  // Filtrar los opcionales basados en el modelo del equipo seleccionado
  const opcionales = productos.filter(
    (producto) => producto.Modelo.includes(selectedModel || '')
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = equiposPrincipales.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(equiposPrincipales.length / itemsPerPage);

  // Función para abrir el modal y establecer los opcionales
  const openModal = (model: string) => {
    setSelectedModel(model);
    setOpcionalesDelModelo(
      productos.filter((producto) => producto.Modelo === model)
    );
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedModel(null);
    setOpcionalesDelModelo([]);
  };

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
            <p className="text-3xl font-bold">{equiposPrincipales.length}</p>
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

        {/* Equipos principales */}
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
                      <th className="px-6 py-4">Opcionales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentProductos.map((producto) => (
                      <tr key={producto.codigo_producto} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono">{producto.codigo_producto}</td>
                        <td className="px-6 py-3">{producto.nombre_del_producto}</td>
                        <td className="px-6 py-3">{producto.Descripcion || <span className="text-gray-400">—</span>}</td>
                        <td className="px-6 py-3">{producto.Modelo || <span className="text-gray-400">—</span>}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => openModal(producto.Modelo)}
                            className="text-blue-600 hover:underline"
                          >
                            Ver opcionales
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* Modal para mostrar opcionales */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl w-1/2">
              <h3 className="text-xl font-bold mb-4">Opcionales para {selectedModel}</h3>
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
                  {opcionalesDelModelo.map((opcional) => (
                    <tr key={opcional.codigo_producto} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono">{opcional.codigo_producto}</td>
                      <td className="px-6 py-3">{opcional.nombre_del_producto}</td>
                      <td className="px-6 py-3">{opcional.Descripcion || <span className="text-gray-400">—</span>}</td>
                      <td className="px-6 py-3">{opcional.Modelo || <span className="text-gray-400">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={closeModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

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
      </main>
    </div>
  );
}