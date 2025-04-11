import React, { useState } from 'react';
import { Calculator, Settings, Info, FileText, Download, RefreshCw, BarChart3, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoEcoAlliance from '../../components/LogoEcoAlliance';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('calculos');
  
  // Estado para los parámetros de cálculo
  const [calculationParams, setCalculationParams] = useState({
    markup: 20,
    descuento: 5,
    tipoIva: 19,
    tasaCambioEUR: 950,
    costoBaseEnvio: 2500,
    costoVariableEnvio: 0.05, // 5% del valor del producto
    seguro: 0.01, // 1% del valor del producto
  });
  
  // Ejemplo de cálculo para mostrar
  const [calculationExample, setCalculationExample] = useState({
    precioBase: 35400,
    precioConMargen: 0,
    precioConDescuento: 0,
    subtotal: 0,
    costoEnvio: 0,
    seguro: 0,
    totalEnvio: 0,
    baseImponible: 0,
    iva: 0,
    totalEUR: 0,
    totalCLP: 0
  });
  
  // Función para actualizar los parámetros
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCalculationParams({
      ...calculationParams,
      [name]: parseFloat(value)
    });
  };
  
  // Función para recalcular el ejemplo
  const recalcularEjemplo = () => {
    const { markup, descuento, tipoIva, tasaCambioEUR, costoBaseEnvio, costoVariableEnvio, seguro } = calculationParams;
    const { precioBase } = calculationExample;
    
    // Cálculo con margen
    const precioConMargen = precioBase * (1 + markup / 100);
    
    // Aplicar descuento
    const valorDescuento = precioConMargen * (descuento / 100);
    const precioConDescuento = precioConMargen - valorDescuento;
    
    // Cálculo de envío
    const costoEnvioVariable = precioConDescuento * costoVariableEnvio;
    const costoEnvio = costoBaseEnvio + costoEnvioVariable;
    
    // Seguro
    const valorSeguro = precioConDescuento * seguro;
    
    // Total envío
    const totalEnvio = costoEnvio + valorSeguro;
    
    // Base imponible (subtotal + envío)
    const baseImponible = precioConDescuento;
    
    // IVA
    const iva = baseImponible * (tipoIva / 100);
    
    // Total EUR
    const totalEUR = baseImponible + iva;
    
    // Total CLP
    const totalCLP = totalEUR * tasaCambioEUR;
    
    setCalculationExample({
      precioBase,
      precioConMargen,
      precioConDescuento,
      subtotal: precioConDescuento,
      costoEnvio,
      seguro: valorSeguro,
      totalEnvio,
      baseImponible,
      iva,
      totalEUR,
      totalCLP
    });
  };
  
  // Ejecutar cálculo inicial
  React.useEffect(() => {
    recalcularEjemplo();
  }, [calculationParams]);
  
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
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
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
          <Link
            to="/admin"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600"
          >
            <Settings className="h-4 w-4" />
            ADMIN
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
          <h2 className="text-xl font-bold">ADMIN</h2>
          <button 
            onClick={recalcularEjemplo}
            className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Actualizar cálculos
          </button>
        </div>
        
        {/* Tabs de navegación */}
        <div className="bg-white shadow-sm mb-4 rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'calculos' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('calculos')}
            >
              Cálculos y Parámetros
            </button>
            
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'configuracion' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('configuracion')}
            >
              Configuración
            </button>
            
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'logs' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('logs')}
            >
              Registro de Actividad
            </button>
          </div>
        </div>
      
        {/* Contenido principal */}
        {activeTab === 'calculos' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-blue-600" />
                Lógica de Cálculo de Detalles Tributarios
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Parámetros de Cálculo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Parámetros de Cálculo</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Margen (%)
                      </label>
                      <input 
                        type="number" 
                        name="markup" 
                        value={calculationParams.markup} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje de margen aplicado al precio base</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descuento (%)
                      </label>
                      <input 
                        type="number" 
                        name="descuento" 
                        value={calculationParams.descuento} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje de descuento aplicado después del margen</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IVA (%)
                      </label>
                      <input 
                        type="number" 
                        name="tipoIva" 
                        value={calculationParams.tipoIva} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje de IVA aplicado al subtotal</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tasa de Cambio EUR a CLP
                      </label>
                      <input 
                        type="number" 
                        name="tasaCambioEUR" 
                        value={calculationParams.tasaCambioEUR} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Valor de 1 EUR en CLP</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Costo Base de Envío (EUR)
                      </label>
                      <input 
                        type="number" 
                        name="costoBaseEnvio" 
                        value={calculationParams.costoBaseEnvio} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Costo fijo base para cualquier envío</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Costo Variable de Envío (como decimal)
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="costoVariableEnvio" 
                        value={calculationParams.costoVariableEnvio} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje del valor del producto (ej: 0.05 = 5%)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seguro (como decimal)
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="seguro" 
                        value={calculationParams.seguro} 
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje del valor del producto (ej: 0.01 = 1%)</p>
                    </div>
                    
                    <button
                      onClick={recalcularEjemplo}
                      className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Recalcular Ejemplo
                    </button>
                  </div>
                </div>
                
                {/* Ejemplo de Cálculo */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Ejemplo de Cálculo</h3>
                  
                  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2">Chipeadora PTO A141XL</h4>
                    <p className="text-sm text-gray-600 mb-4">Demostración paso a paso del cálculo de precios</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">Precio Base:</span>
                        <span className="text-gray-900 font-medium">{calculationExample.precioBase.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">+ Margen ({calculationParams.markup}%):</span>
                        <span className="text-blue-600 font-medium">{(calculationExample.precioConMargen - calculationExample.precioBase).toFixed(2)} €</span>
                        
                        <span className="text-gray-600">= Precio con Margen:</span>
                        <span className="text-gray-900 font-medium">{calculationExample.precioConMargen.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">- Descuento ({calculationParams.descuento}%):</span>
                        <span className="text-red-600 font-medium">{(calculationExample.precioConMargen - calculationExample.precioConDescuento).toFixed(2)} €</span>
                        
                        <span className="text-gray-600">= Subtotal:</span>
                        <span className="text-gray-900 font-medium">{calculationExample.subtotal.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">+ IVA ({calculationParams.tipoIva}%):</span>
                        <span className="text-blue-600 font-medium">{calculationExample.iva.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">= Total (EUR):</span>
                        <span className="text-gray-900 font-semibold">{calculationExample.totalEUR.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">= Total (CLP):</span>
                        <span className="text-gray-900 font-semibold">{calculationExample.totalCLP.toLocaleString('es-CL')} CLP</span>
                      </div>
                      
                      <hr className="my-2" />
                      
                      <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 font-medium">Detalles de Envío:</span>
                        <span></span>
                        
                        <span className="text-gray-600">Costo Base:</span>
                        <span className="text-gray-900">{calculationParams.costoBaseEnvio.toFixed(2)} €</span>
                        
                        <span className="text-gray-600">Costo Variable ({(calculationParams.costoVariableEnvio * 100).toFixed(0)}%):</span>
                        <span className="text-gray-900">{(calculationExample.subtotal * calculationParams.costoVariableEnvio).toFixed(2)} €</span>
                        
                        <span className="text-gray-600">Seguro ({(calculationParams.seguro * 100).toFixed(0)}%):</span>
                        <span className="text-gray-900">{calculationExample.seguro.toFixed(2)} €</span>
                        
                        <span className="text-gray-600 font-medium">Total Envío:</span>
                        <span className="text-gray-900 font-medium">{calculationExample.totalEnvio.toFixed(2)} €</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Fórmulas aplicadas:</h5>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>1. Precio con margen = Precio base × (1 + Margen%/100)</li>
                        <li>2. Descuento = Precio con margen × (Descuento%/100)</li>
                        <li>3. Subtotal = Precio con margen - Descuento</li>
                        <li>4. IVA = Subtotal × (IVA%/100)</li>
                        <li>5. Total EUR = Subtotal + IVA</li>
                        <li>6. Total CLP = Total EUR × Tasa de cambio</li>
                        <li>7. Costo variable envío = Subtotal × Porcentaje variable</li>
                        <li>8. Seguro = Subtotal × Porcentaje seguro</li>
                        <li>9. Total envío = Costo base + Costo variable + Seguro</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Descargar documentación completa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Acceso administrador</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Esta sección muestra la lógica de cálculo utilizada en toda la aplicación para determinar precios, 
                      impuestos y costos de envío. Los cambios en estos parámetros afectarán a todas las cotizaciones nuevas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'configuracion' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración del Sistema</h2>
            <p className="text-gray-600">Este panel está en desarrollo. Aquí se podrán configurar aspectos generales del sistema.</p>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Registro de Actividad</h2>
            <p className="text-gray-600">Este panel está en desarrollo. Aquí se mostrarán los registros de actividad del sistema.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 