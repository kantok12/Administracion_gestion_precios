// Archivo: src/Cotizar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, BarChart2, Clock, Search, PlusCircle, X } from "lucide-react";

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

export default function Cotizar() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Opcional[]>([]);
  const [selectedOpcionales, setSelectedOpcionales] = useState<Opcional[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const WEBHOOK_URL_PRINCIPAL = "https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f";
  const WEBHOOK_URL_OPCIONALES = "https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254";

  useEffect(() => {
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
    obtenerDatos();
  }, []);

  const handleCotizar = async (producto: Producto) => {
    setProductoSeleccionado(producto);
    try {
      const url = `${WEBHOOK_URL_OPCIONALES}?codigo=${producto.codigo_producto}&modelo=${producto.Modelo}&categoria=${producto.categoria}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Opcional[] = await res.json();
      setModalData(data);
      setCurrentPage(1);
      setModalVisible(true);
      setSelectedOpcionales([]);
    } catch (err) {
      console.error("Error al cotizar:", err);
    }
  };

  const handleCheckboxChange = (opcional: Opcional) => {
    setSelectedOpcionales((prev) => {
      const exists = prev.find((item) => item.codigo_producto === opcional.codigo_producto);
      if (exists) {
        return prev.filter((item) => item.codigo_producto !== opcional.codigo_producto);
      } else {
        return [...prev, opcional];
      }
    });
  };

  const handleCalcular = () => {
    if (!productoSeleccionado) return;
    navigate("/calculo", {
      state: {
        productoPrincipal: productoSeleccionado,
        opcionalesSeleccionados: selectedOpcionales,
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalVisible) {
        setModalVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalVisible]);

  const productosFiltrados = productos.filter((p) =>
    [p.codigo_producto, p.nombre_del_producto, p.Descripcion].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOpcionales = modalData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(modalData.length / itemsPerPage);

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
            <BarChart2 className="h-5 w-5" /> EQUIPOS
          </Link>
          <Link to="/cotizar" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <Clock className="h-5 w-5" /> COTIZAR
          </Link>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Cotización</h2>
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
                <th className="w-20 p-4 text-center">Cotizar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosFiltrados.map((p) => (
                <tr key={p.codigo_producto} className="hover:bg-gray-50">
                  <td className="p-4 font-mono">{p.codigo_producto}</td>
                  <td className="p-4">{p.nombre_del_producto}</td>
                  <td className="p-4">{p.Descripcion}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleCotizar(p)} className="text-blue-600 hover:text-blue-800">
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Cotización */}
      {modalVisible && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 h-[90vh] p-6 flex flex-col">
            <button onClick={() => setModalVisible(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Detalle de Cotización</h2>

            {currentOpcionales.length > 0 ? (
              <div className="flex-1 overflow-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-2 border text-center">Seleccionar</th>
                      <th className="p-2 border">codigo_producto</th>
                      <th className="p-2 border">nombre_del_producto</th>
                      <th className="p-2 border">Descripcion</th>
                      <th className="p-2 border">Modelo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOpcionales.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectedOpcionales.some(op => op.codigo_producto === item.codigo_producto)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                        </td>
                        <td className="p-2 border">{item.codigo_producto}</td>
                        <td className="p-2 border">{item.nombre_del_producto}</td>
                        <td className="p-2 border">{item.Descripcion}</td>
                        <td className="p-2 border">{item.Modelo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay datos disponibles.</p>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >←</button>
              <span className="text-gray-700 font-semibold">{currentPage} de {totalPages}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >→</button>
            </div>

            {/* Botón "Calcular" */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleCalcular}
              >Calcular</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}