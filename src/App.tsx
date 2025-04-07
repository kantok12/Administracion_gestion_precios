import React, { useState } from 'react';
import {
  DollarSign,
  BarChart3,
  Clock,
  Settings,
  BarChart2,   // icono para la tabla
} from 'lucide-react';

interface HtmlItem {
  data: string;          // cada objeto que viene del HTTP Request
}

export default function App() {
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [items, setItems]           = useState<HtmlItem[]>([]);
  const [loading, setLoading]       = useState(false);

  /** Llama a n8n y guarda la respuesta en `items` */
  const handleWebhook = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'https://n8n-807184488368.southamerica-west1.run.app/webhook-test/6f697684-4cfc-4bc1-8918-bfffc9f20b9f',
        { method: 'GET' }        // <-- GET porque solo quieres leer
      );

      if (!res.ok) throw new Error('Error en la petición');

      const data: HtmlItem[] = await res.json();  // [{ data: '<!doctype html>...' }, ...]
      setItems(data);
    } catch (err) {
      console.error(err);
      alert('No se pudo obtener la información.');
    } finally {
      setLoading(false);
    }
  };

  /** Renderiza cada fragmento HTML en un <iframe> para aislar estilos/scripts */
  const renderPreview = (html: string) => (
    <iframe
      style={{ width: '100%', height: 200, border: '1px solid #e5e7eb', borderRadius: 8 }}
      srcDoc={html}
      sandbox=""
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ────────── Sidebar ────────── */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8">
        <header className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">PriceSync Pro</h1>
        </header>

        <nav className="space-y-2">
          <button
            onClick={handleWebhook}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              ${activeTab === 'webhook' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <BarChart2 className="h-5 w-5" />
            Obtener Datos
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              ${activeTab === 'automation' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <Clock className="h-5 w-5" />
            Automation
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* ────────── Main panel ────────── */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">HTTP Request Results</h2>

        {/* Tarjeta resumen */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold">{items.length}</p>
          </div>
        </div>

        {/* Tabla / previews */}
        {loading ? (
          <p className="text-gray-600">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Haz clic en “Obtener Datos” para traer la información.</p>
        ) : (
          <div className="space-y-8">
            {items.map((it, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2">Item {idx + 1}</h3>
                {renderPreview(it.data)}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}