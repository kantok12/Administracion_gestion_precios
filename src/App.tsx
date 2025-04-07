import React, { useState } from 'react';
import {
  DollarSign,
  BarChart3,
  Clock,
  Settings,
  BarChart2,
} from 'lucide-react';

/* ---------- Interfaz que corresponde al nuevo formato del JSON ---------- */
interface Producto {
  codigo_producto:    string;
  nombre_del_producto: string;
  Descripcion:        string;
  Valor:              string;
}

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /* URL del Webhook (reemplázala con la tuya) */
  const WEBHOOK_URL =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook-test/6f697684-4cfc-4bc1-8918-bfffc9f20b9f';

  /* ---------- Traer los datos del Webhook ---------- */
  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(WEBHOOK_URL);

      if (!res.ok) {
        const errorText = await res.text();  // Obtener el cuerpo de la respuesta como texto
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const txt = await res.text();
        throw new Error('Respuesta NO-JSON:\n' + txt.slice(0, 120));
      }

      const data: Producto[] = await res.json();
      setProductos(data);
    } catch (err: any) {
      console.error('Error durante la petición:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">PriceSync Pro</h1>
        </header>

        <nav className="space-y-2">
          <button
            onClick={obtenerDatos}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
          >
            <BarChart2 className="h-5 w-5" />
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

      {/* Main panel */}
      <main className="flex-1 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Resultados del Webhook</h2>

        {/* Resumen */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold">{productos.length}</p>
          </div>
        </div>

        {/* Estado de carga o error */}
        {loading && <p className="text-gray-600">Cargando…</p>}
        {error && (
          <div className="text-red-600 mb-4 p-4 border-2 border-red-600 rounded-md">
            <p className="font-semibold">Error al obtener los datos:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Tabla */}
        {!loading && !error && (
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-auto">
            {productos.length === 0 ? (
              <p className="text-gray-500 p-6">
                No hay datos — pulsa “Obtener Datos” para traer la información.
              </p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map((p) => (
                    <tr key={p.codigo_producto} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono">
                        {p.codigo_producto}
                      </td>
                      <td className="px-6 py-3">
                        {p.nombre_del_producto}
                      </td>
                      <td className="px-6 py-3">
                        {p.Descripcion || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-3">
                        {p.Valor || <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}