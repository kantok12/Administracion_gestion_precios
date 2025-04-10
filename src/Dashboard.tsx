import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  BarChart3,
  Clock,
  BarChart2,
  Search,
  PlusCircle,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Package,
  DollarSign as DollarIcon,
  Percent,
  Loader,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoEcoAlliance from './components/LogoEcoAlliance';

// Interfaces
interface DolarData {
  fecha: string;
  valor: number;
  variacion: number;
}

interface PrecioFuturo {
  fecha: string;
  precio: number;
  tendencia: 'up' | 'down';
}

interface ChipeadoraStats {
  totalCotizaciones: number;
  cotizacionesMes: number;
  promedioCotizacion: number;
  chipeadorasMasCotizadas: {
    nombre: string;
    cotizaciones: number;
  }[];
}

export default function Dashboard() {
  // ----------- Estados principales -----------
  const [dolarActual, setDolarActual] = useState<DolarData>({
    fecha: new Date().toLocaleDateString(),
    valor: 850.25,
    variacion: 2.5,
  });
  
  const [preciosFuturos, setPreciosFuturos] = useState<PrecioFuturo[]>([
    { fecha: '2023-11-01', precio: 865.50, tendencia: 'up' },
    { fecha: '2023-12-01', precio: 872.75, tendencia: 'up' },
    { fecha: '2024-01-01', precio: 880.25, tendencia: 'up' },
    { fecha: '2024-02-01', precio: 875.50, tendencia: 'down' },
    { fecha: '2024-03-01', precio: 882.25, tendencia: 'up' },
    { fecha: '2024-04-01', precio: 890.75, tendencia: 'up' },
    { fecha: '2024-05-01', precio: 895.50, tendencia: 'up' },
    { fecha: '2024-06-01', precio: 900.25, tendencia: 'up' },
  ]);

  const [chipeadoraStats, setChipeadoraStats] = useState<ChipeadoraStats>({
    totalCotizaciones: 156,
    cotizacionesMes: 23,
    promedioCotizacion: 12500,
    chipeadorasMasCotizadas: [
      { nombre: 'Chipeadora Industrial 3000', cotizaciones: 45 },
      { nombre: 'Chipeadora Semi-Industrial 2000', cotizaciones: 38 },
      { nombre: 'Chipeadora Residencial 1000', cotizaciones: 32 },
      { nombre: 'Chipeadora Compacta 500', cotizaciones: 25 },
      { nombre: 'Chipeadora Profesional 2500', cotizaciones: 16 },
    ],
  });

  // Estado de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ----------- Webhooks -----------
  const WEBHOOK_URL_DOLAR =
    'https://n8n-807184488368.southamerica-west1.run.app/webhook/8012d60e-8a29-4910-b385-6514edc3d912';

  const [dollarValue, setDollarValue] = useState(null);
  const [euroValue, setEuroValue] = useState(null);

  // ========== 1) Carga inicial de datos ==========
  const obtenerDatosDolar = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://n8n-807184488368.southamerica-west1.run.app/webhook/8012d60e-8a29-4910-b385-6514edc3d912');
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      console.log('Datos recibidos del webhook:', data);
      if (Array.isArray(data) && data.length > 0) {
        setDolarActual({
          fecha: data[0].Fecha,
          valor: parseFloat(data[0].Valor_Dolar),
          variacion: 0, // Puedes calcular la variación si es necesario
        });
        setDollarValue(data[0].Valor_Dolar);
        setEuroValue(data[0].Valor_Euro);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al actualizar datos');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatosDolar();
    // Actualizar cada 5 minutos
    const interval = setInterval(obtenerDatosDolar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ========== 2) Función para actualizar manualmente ========== 
  const handleRefresh = () => {
    if (!refreshing) {
      obtenerDatosDolar();
    }
  };

  // ========== 3) Render Principal ==========
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md p-4 flex flex-col">
        <header className="mb-4">
          <LogoEcoAlliance className="h-20 ml-0" />
        </header>

        {/* Menú Lateral */}
        <nav className="space-y-1 mt-4 flex-1">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600"
          >
            <BarChart3 className="h-4 w-4" />
            DASHBOARD
          </Link>
          <Link
            to="/equipos"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
          >
            <BarChart2 className="h-4 w-4" />
            EQUIPOS
          </Link>
        </nav>
        
        {/* Botón de configuración en la parte inferior */}
        <div className="pt-2 border-t mt-auto">
          <Link
            to="/configuracion"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            CONFIGURACIÓN
          </Link>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 p-4 flex flex-col max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">DASHBOARD</h2>
          <button 
            onClick={handleRefresh} 
            className={`flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar datos'}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <X className="h-4 w-4" />
            <span>{error}</span>
            <button 
              onClick={handleRefresh}
              className="ml-auto text-xs px-2 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Tarjeta de Dólar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Valor del Dólar</h3>
              <DollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold">${dollarValue || dolarActual.valor.toFixed(2)}</div>
                  <div className={`flex items-center ${dolarActual.variacion >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dolarActual.variacion >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    <span className="font-semibold">{Math.abs(dolarActual.variacion).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">Impacto en precios de chipeadoras</div>
              </>
            )}
          </div>

          {/* Tarjeta de Euro */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Valor del Euro</h3>
              <DollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold">${euroValue || 'Cargando...'}</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">Impacto en precios de chipeadoras</div>
              </>
            )}
          </div>

          {/* Total Cotizaciones */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Cotizaciones</h3>
              <BarChart2 className="h-5 w-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold">{chipeadoraStats.totalCotizaciones}</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">Cotizaciones realizadas</div>
              </>
            )}
          </div>

          {/* Cotizaciones del Mes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cotizaciones del Mes</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold">{chipeadoraStats.cotizacionesMes}</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">Cotizaciones este mes</div>
              </>
            )}
          </div>

          {/* Promedio de Cotización */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Promedio de Cotización</h3>
              <DollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold">${chipeadoraStats.promedioCotizacion.toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">Valor promedio por cotización</div>
              </>
            )}
          </div>
        </div>

        {/* Gráfico de Precios Futuros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Proyección de Precios del Dólar</h3>
          <p className="text-sm text-gray-500 mb-4">Estos cambios afectarán directamente los precios de las chipeadoras</p>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Precio Proyectado</th>
                    <th className="px-6 py-4">Tendencia</th>
                    <th className="px-6 py-4">Impacto en Chipeadoras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preciosFuturos.map((precio, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{precio.fecha}</td>
                      <td className="px-6 py-3 font-mono">${precio.precio.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        {precio.tendencia === 'up' ? (
                          <div className="flex items-center text-green-500">
                            <TrendingUp className="h-5 w-5 mr-1" />
                            <span>Alza</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-500">
                            <TrendingDown className="h-5 w-5 mr-1" />
                            <span>Baja</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {precio.tendencia === 'up' ? (
                          <span className="text-red-500">Aumento de precios</span>
                        ) : (
                          <span className="text-green-500">Reducción de precios</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chipeadoras Más Cotizadas */}
        <div className="bg-white rounded-xl shadow-sm p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Chipeadoras Más Cotizadas</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Modelo</th>
                    <th className="px-6 py-4">Cotizaciones</th>
                    <th className="px-6 py-4">% del Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {chipeadoraStats.chipeadorasMasCotizadas.map((chipeadora, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{chipeadora.nombre}</td>
                      <td className="px-6 py-3">{chipeadora.cotizaciones}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(chipeadora.cotizaciones / chipeadoraStats.totalCotizaciones) * 100}%` }}
                            ></div>
                          </div>
                          <span>{((chipeadora.cotizaciones / chipeadoraStats.totalCotizaciones) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 