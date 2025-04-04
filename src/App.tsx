import React, { useState } from 'react';
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  Settings, 
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface PriceItem {
  id: number;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  lastUpdate: string;
  status: 'active' | 'pending' | 'archived';
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<PriceItem[]>([]);  // Estado para almacenar productos

  // Función para manejar el webhook y actualizar el estado de productos
  const handleWebhook = async () => {
    try {
      // Realiza la solicitud POST al webhook
      const response = await fetch('https://n8n-807184488368.southamerica-west1.run.app/webhook-test/6f697684-4cfc-4bc1-8918-bfffc9f20b9f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Webhook triggered',
          timestamp: new Date().toISOString(),
        }),
      });

      // Verificar si la solicitud fue exitosa
      if (response.ok) {
        const data = await response.json();  // Obtener los datos del Webhook

        // Actualizar el estado con los nuevos productos que llegan desde el Webhook
        setProducts(data.products);  // Asumiendo que los datos que devuelves desde n8n tienen un campo 'products'
        alert('Webhook ejecutado con éxito!');
      } else {
        alert('Hubo un error al ejecutar el webhook.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error de red.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">PriceSync Pro</h1>
          </div>
          <nav className="space-y-2">
            {/* Botón Webhook */}
            <button 
              onClick={handleWebhook}  // Llama la función handleWebhook cuando se hace clic
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === 'webhook' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Webhook
            </button>
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === 'automation' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Clock className="h-5 w-5" />
              Automation
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Price List Management</h2>
          <p className="text-gray-600">Monitor and manage your automated price updates</p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Download className="h-5 w-5" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Upload className="h-5 w-5" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-5 w-5" />
              Add New Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Updates</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Price Changes Today</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price List Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Current Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Previous Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Last Update</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-gray-900">${item.currentPrice}</td>
                  <td className="px-6 py-4 text-gray-600">${item.previousPrice}</td>
                  <td className="px-6 py-4 text-gray-600">{item.lastUpdate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;