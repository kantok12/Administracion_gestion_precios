import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  BarChart3,
  Clock,
  BarChart2,
  Search,
  PlusCircle,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Interfaces
interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
  categoria?: string;
}

interface Opcional {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
}

export default function App() {
  // ----------- Estados principales -----------
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginación de productos
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal de opcionales
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [opcionalesData, setOpcionalesData] = useState<Opcional[] | null>(null);

  // Paginación de opcionales
  const [opcionalesPage, setOpcionalesPage] = useState(1);
  const opcionalesPerPage = 10;

  // Selección de producto al hacer clic en la fila (para "Cotizar")
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  // ----------- Modal para "Ver Detalle" con JSON aplanado -----------
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [flattenedData, setFlattenedData] = useState<Record<string, any>>({});

  // ----------- Webhooks -----------
  const WEBHOOK_URL_PRINCIPAL =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f';

  const WEBHOOK_URL_OPCIONALES =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254';

  const WEBHOOK_URL_VER_DETALLE =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/c02247e7-84f0-49b3-a2df-28817da48017';

  // ========== 1) Carga inicial de productos ==========
  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(WEBHOOK_URL_PRINCIPAL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Producto[] = await res.json();
      setProductos(data);
      setCurrentPage(1);
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

  // ========== 2) Cerrar modales al presionar ESC ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cierra modal de opcionales
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
      // Cierra modal de JSON
      if (e.key === 'Escape' && showJsonModal) {
        setShowJsonModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, showJsonModal]);

  // ========== 3) Función recursiva para aplanar objetos ==========
  const flattenObject = (obj: any): Record<string, any> => {
    const result: Record<string, any> = {};
    function recurse(cur: any, prop: string) {
      if (Object(cur) === cur && !Array.isArray(cur)) {
        let isEmpty = true;
        for (const p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + ' / ' + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      } else {
        result[prop] = cur;
      }
    }
    recurse(obj, '');
    return result;
  };

  // ========== 4) "Ver Detalle" con GET y modal JSON aplanado ==========
  const handleVerDetalle = async (producto: Producto) => {
    try {
      const url = `${WEBHOOK_URL_VER_DETALLE}?codigo=${producto.codigo_producto}&modelo=${producto.Modelo}&categoria=${producto.categoria}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      // Tomamos la respuesta (array u objeto)
      const data = await response.json();
      const firstItem = Array.isArray(data) ? data[0] : data;

      // Aplanamos
      const flattened = flattenObject(firstItem || {});
      setFlattenedData(flattened);

      // Mostramos el modal
      setShowJsonModal(true);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      alert('Hubo un error al procesar la solicitud');
    }
  };

  // ========== 5) Filtrar y paginar la tabla principal ==========
  const productosFiltrados = productos.filter((p) =>
    [p.codigo_producto, p.nombre_del_producto, p.Descripcion, p.Modelo]
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  // ========== 6) Modal de Opcionales (botón "+") ==========
  const handleOpenModal = async (producto: Producto) => {
    setProductoSeleccionado(producto);
    setOpcionalesPage(1);

    const codigoParam = encodeURIComponent(producto.codigo_producto);
    const modeloParam = encodeURIComponent(producto.Modelo || '');
    const categoriaParam = encodeURIComponent(producto.categoria || '');

    try {
      const resp = await fetch(
        `${WEBHOOK_URL_OPCIONALES}?codigo=${codigoParam}&modelo=${modeloParam}&categoria=${categoriaParam}`
      );
      if (!resp.ok) throw new Error(`Error al obtener opcionales: ${resp.status}`);
      const data: Opcional[] = await resp.json();
      setOpcionalesData(data);
    } catch (err) {
      console.error('Error cargando opcionales:', err);
      setOpcionalesData(null);
    }

    setShowModal(true);
  };

  // Cerrar modal de Opcionales
  const handleCloseModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
    setOpcionalesData(null);
  };

  // Paginación de Opcionales
  const indexOfLastOpcional = opcionalesPage * opcionalesPerPage;
  const indexOfFirstOpcional = indexOfLastOpcional - opcionalesPerPage;
  const currentOpcionales =
    opcionalesData && opcionalesData.slice(indexOfFirstOpcional, indexOfLastOpcional);
  const totalOpcionalesPages = opcionalesData
    ? Math.ceil(opcionalesData.length / opcionalesPerPage)
    : 0;

  // ========== 7) Selección de Fila (omitir botones) ==========
  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    producto: Producto
  ) => {
    // Si clic en un button, no seleccionamos
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setSelectedProduct(producto);
  };

  // ========== 8) Botón "Cotizar" => redirigir a otra ruta ==========
  const handleCotizar = () => {
    if (!selectedProduct) return;
    window.location.href = '/cotizar';
  };

  // -----------------------------------------------------------
  // Render Principal
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Sistema de Precios</h1>
        </header>

        {/* Menú Lateral */}
        <nav className="space-y-2">
          <Link
            to="/equipos"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart2 className="h-5 w-5" />
            EQUIPOS
          </Link>

          {/* NUEVO: Botón para ir a "/cotizar" */}
          <Link
            to="/cotizar"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <Clock className="h-5 w-5" />
            COTIZAR
          </Link>
        </nav>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">EQUIPOS</h2>

        {/* Barra de búsqueda */}
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

        {/* Tabla Principal */}
        {!loading && !error && (
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Modelo</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4 text-center">Ver Detalle</th>
                  <th className="px-6 py-4 text-center">Opcionales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentProductos.map((p) => (
                  <tr
                    key={p.codigo_producto}
                    className="hover:bg-gray-50"
                    onClick={(e) => handleRowClick(e, p)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-6 py-3 font-mono">{p.codigo_producto}</td>
                    <td className="px-6 py-3">{p.nombre_del_producto}</td>
                    <td className="px-6 py-3">
                      {p.Descripcion || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-3">{p.Modelo || <span className="text-gray-400">—</span>}</td>
                    <td className="px-6 py-3">{p.categoria || <span className="text-gray-400">—</span>}</td>

                    {/* Botón "Ver Detalle" */}
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleVerDetalle(p)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver Detalle
                      </button>
                    </td>

                    {/* Botón "Opcionales" */}
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="inline-flex items-center justify-center"
                      >
                        <PlusCircle className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación de Productos */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="text-gray-700 font-semibold">
                {currentPage} de {Math.ceil(productosFiltrados.length / itemsPerPage)}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(productosFiltrados.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(productosFiltrados.length / itemsPerPage)}
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Botón "Cotizar" si hay fila seleccionada */}
        {selectedProduct && (
          <div className="mt-6">
            <p className="text-gray-600 mb-2">
              Producto seleccionado: <strong>{selectedProduct.nombre_del_producto}</strong>
            </p>
            <button
              onClick={handleCotizar}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cotizar
            </button>
          </div>
        )}
      </main>

      {/* Modal de Opcionales */}
      {showModal && productoSeleccionado && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">
                Opcionales de {productoSeleccionado.nombre_del_producto}
              </h2>
            </div>

            <div className="p-6">
              {currentOpcionales && currentOpcionales.length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100 font-semibold text-gray-600">
                      <tr>
                        <th className="p-2 border">Código</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Modelo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOpcionales.map((op) => (
                        <tr key={op.codigo_producto}>
                          <td className="p-2 border">{op.codigo_producto}</td>
                          <td className="p-2 border">{op.nombre_del_producto}</td>
                          <td className="p-2 border">{op.Descripcion}</td>
                          <td className="p-2 border">{op.Modelo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación Opcionales */}
                  <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      onClick={() => setOpcionalesPage((prev) => Math.max(prev - 1, 1))}
                      disabled={opcionalesPage === 1}
                    >
                      ←
                    </button>
                    <span className="text-gray-700 font-semibold">
                      {opcionalesPage} de {Math.ceil((opcionalesData?.length || 0) / opcionalesPerPage)}
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      onClick={() =>
                        setOpcionalesPage((prev) =>
                          Math.min(prev + 1, Math.ceil((opcionalesData?.length || 0) / opcionalesPerPage))
                        )
                      }
                      disabled={opcionalesPage === Math.ceil((opcionalesData?.length || 0) / opcionalesPerPage)}
                    >
                      →
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No hay opcionales para mostrar.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal "Ver Detalle" (JSON aplanado) */}
      {showJsonModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-10/12 max-w-4xl p-6">
            <button
              onClick={() => setShowJsonModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Detalle en forma de Tabla</h2>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100 font-semibold text-gray-600">
                <tr>
                  <th className="p-2 border">Título</th>
                  <th className="p-2 border">Valor</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(flattenedData).length > 0 ? (
                  Object.entries(flattenedData).map(([key, value], index) => (
                    <tr key={index}>
                      <td className="p-2 border">{key}</td>
                      <td className="p-2 border">{String(value)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border" colSpan={2}>
                      No hay datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}