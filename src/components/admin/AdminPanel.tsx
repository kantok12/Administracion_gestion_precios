import React, { useState, useEffect } from 'react';
import { Calculator, Settings, Info, RefreshCw, BarChart3, BarChart2, Save, Clock, DollarSign, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoEcoAlliance from '../../components/LogoEcoAlliance';

// Objeto de caché para almacenar los valores de las divisas
const currencyCache = {
  dolar: null as number | null,
  euro: null as number | null,
  lastUpdated: null as Date | null,
};

const AdminPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const machineCategories = ['Excavadoras', 'Cargadores', 'Compactadoras', 'Grúas', 'Tractores'];
  const [activeTab, setActiveTab] = useState<string>('calculos');
  const [isUpdatingCurrency, setIsUpdatingCurrency] = useState<boolean>(false);
  
  // Estado para los parámetros de cálculo
  const [calculationParams, setCalculationParams] = useState({
    // Parámetros monetarios
    costoPrincipal: 35400,
    costoFabricaOriginalEUR: 28500,
    descuentoFabricante: 5, // en porcentaje
    
    // Tipos de cambio
    tipoCambioEURUSD: 1.12, // EUR a USD
    bufferEURUSD: 2.5, // en porcentaje
    dolarObservadoCLP: null as number | null,
    euroObservadoCLP: null as number | null,
    bufferUSDCLP: 1.8, // en porcentaje
    
    // Parámetros de envío y seguro
    tasaSeguro: 1, // en porcentaje
    bufferTransporte: 5, // en porcentaje
    
    // Márgenes y cálculos adicionales
    margenAdicionalTotal: 20, // en porcentaje
    
    // Fechas
    fechaUltimaActualizacion: new Date().toISOString().split('T')[0],
    fechaActualizacionDivisas: ''
  });
  
  // URL del webhook para obtener el valor de las divisas
  const WEBHOOK_URL_DIVISAS = "https://n8n-807184488368.southamerica-west1.run.app/webhook/8012d60e-8a29-4910-b385-6514edc3d912";
  
  // Función para convertir cadenas a números
  const toNum = (s: string) => parseFloat(s.replace(/\./g, '').replace(',', '.'));

  // Modificar la función roundToNearestInteger para truncar los valores después de la coma
  const truncateToInteger = (value: number): number => {
    return Math.floor(value);
  };

  // Función para actualizar los parámetros
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir a número si es un campo numérico
    const numericFields = [
      'costoPrincipal',
      'costoFabricaOriginalEUR',
      'descuentoFabricante',
      'tipoCambioEURUSD',
      'bufferEURUSD',
      'bufferUSDCLP',
      'tasaSeguro',
      'bufferTransporte',
      'margenAdicionalTotal'
    ];
    
    const newValue = numericFields.includes(name) && value !== '' 
      ? toNum(value) 
      : value;
    
    setCalculationParams({
      ...calculationParams,
      [name]: newValue
    });
  };
  
  const handleSaveParams = () => {
    alert("Parámetros guardados con éxito");
    console.log("Parámetros guardados:", calculationParams);
  };
  
  // Función para obtener los valores del dólar y euro desde el webhook
  const fetchCurrencyValues = async () => {
    try {
      setIsUpdatingCurrency(true);
      const response = await fetch(WEBHOOK_URL_DIVISAS);

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      const currencyData = Array.isArray(data) ? data[0] : data;

      if (
        currencyData &&
        (
          ("Valor_Dolar" in currencyData && "Valor_Euro" in currencyData) ||
          ("valor_dolar" in currencyData && "valor_euro" in currencyData)
        )
      ) {
        let dolarValue = toNum(currencyData.Valor_Dolar || currencyData.valor_dolar);
        let euroValue = toNum(currencyData.Valor_Euro || currencyData.valor_euro);

        if (isNaN(dolarValue) || isNaN(euroValue)) {
          throw new Error("Valores no numéricos");
        }

        dolarValue = truncateToInteger(dolarValue / 100);
        euroValue = truncateToInteger(euroValue / 100);

        // Actualizar caché
        currencyCache.dolar = dolarValue;
        currencyCache.euro = euroValue;
        currencyCache.lastUpdated = new Date();

        // Actualizar estado
        setCalculationParams(prev => ({
          ...prev,
          dolarObservadoCLP: dolarValue,
          euroObservadoCLP: euroValue,
          fechaActualizacionDivisas: currencyData.Fecha || currencyData.fecha || ''
        }));

      } else {
        throw new Error("Formato de datos incorrecto");
      }
    } catch (error) {
      console.error("Error en la actualización de divisas:", error);
    } finally {
      setIsUpdatingCurrency(false);
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Efecto para la actualización automática diaria
  useEffect(() => {
    fetchCurrencyValues();
    
    const checkTimeAndUpdate = () => {
      const now = new Date();
      if (now.getHours() === 12 && now.getMinutes() === 0) {
        fetchCurrencyValues();
      }
    };
    
    const intervalId = setInterval(checkTimeAndUpdate, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <LogoEcoAlliance className="h-12 mb-8" />
        
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
        
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Link 
            to="/configuracion" 
            className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Settings size={18} />
            <span>Configuración</span>
          </Link>
        </div>
      </aside>
      
      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
          <h1 className="text-2xl font-bold">ADMIN</h1>
          
          <button 
            onClick={handleSaveParams} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
        
        {/* Pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('calculos')}
                className={`
                  py-3 px-4 border-b-2 font-medium text-sm
                  ${activeTab === 'calculos' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Cálculos y Parámetros
              </button>
              
              <button
                onClick={() => setActiveTab('configuracion')}
                className={`
                  py-3 px-4 border-b-2 font-medium text-sm
                  ${activeTab === 'configuracion' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Configuración
              </button>
              
              <button
                onClick={() => setActiveTab('logs')}
                className={`
                  py-3 px-4 border-b-2 font-medium text-sm
                  ${activeTab === 'logs' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Registro de Actividad
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenido de la pestaña activa */}
        {activeTab === 'calculos' && (
          <div>
            <div className="mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calculator className="text-blue-500 mr-2" size={20} />
                  <h2 className="text-lg font-semibold">Parámetros de Cálculo y Costos</h2>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
                    Filtrar por Categoría:
                  </label>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-48 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas las Categorías</option>
                    {machineCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Sección de divisas */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Valores Actuales de Divisas</h3>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchCurrencyValues}
                      disabled={isUpdatingCurrency}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50"
                    >
                      {isUpdatingCurrency ? (
                        <>
                          <RefreshCw className="animate-spin" size={14} />
                          <span>Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} />
                          <span>Actualizar Divisas</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>
                        {currencyCache.lastUpdated ? `Última actualización: ${currencyCache.lastUpdated.toLocaleString()}` : 'Sin actualización reciente'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dólar */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center mb-2">
                      <DollarSign className="text-blue-500 mr-2" size={16} />
                      <span className="font-medium">Dólar Observado Actual (CLP)</span>
                    </div>
                    
                    <input
                      type="text"
                      name="dolarObservadoCLP"
                      value={calculationParams.dolarObservadoCLP !== null ? String(calculationParams.dolarObservadoCLP) : ''}
                      onChange={handleParamChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    
                    {calculationParams.fechaActualizacionDivisas && (
                      <p className="mt-1 text-xs text-gray-500">
                        Valor del {calculationParams.fechaActualizacionDivisas}
                      </p>
                    )}
                  </div>
                  
                  {/* Euro */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center mb-2">
                      <Euro className="text-green-500 mr-2" size={16} />
                      <span className="font-medium">Euro Observado Actual (CLP)</span>
                    </div>
                    
                    <input
                      type="text"
                      name="euroObservadoCLP"
                      value={calculationParams.euroObservadoCLP !== null ? String(calculationParams.euroObservadoCLP) : ''}
                      onChange={handleParamChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    
                    {calculationParams.fechaActualizacionDivisas && (
                      <p className="mt-1 text-xs text-gray-500">
                        Valor del {calculationParams.fechaActualizacionDivisas}
                      </p>
                    )}
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-blue-600 flex items-center">
                  <Info size={12} className="mr-1" />
                  Los valores se actualizan automáticamente todos los días a las 12:00 PM. También puedes actualizar manualmente.
                </p>
              </div>
              
              {/* Parámetros de cálculo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Costos Base */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="font-medium mb-4">Costos Base</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Costo Fábrica Original (EUR)
                      </label>
                      <input
                        type="text"
                        name="costoFabricaOriginalEUR"
                        value={calculationParams.costoFabricaOriginalEUR}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Costo base desde el fabricante</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Descuento Fabricante (%)
                      </label>
                      <input
                        type="text"
                        name="descuentoFabricante"
                        value={calculationParams.descuentoFabricante}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje de descuento aplicado</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Margen Adicional Total (%)
                      </label>
                      <input
                        type="text"
                        name="margenAdicionalTotal"
                        value={calculationParams.margenAdicionalTotal}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Margen de costo adicional</p>
                    </div>
                  </div>
                </div>
                
                {/* Tipos de Cambio */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="font-medium mb-4">Tipos de Cambio</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tipo de Cambio EUR/USD
                      </label>
                      <input
                        type="text"
                        name="tipoCambioEURUSD"
                        value={calculationParams.tipoCambioEURUSD}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Tasa actual Euro a Dólar</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Buffer EUR/USD (%)
                      </label>
                      <input
                        type="text"
                        name="bufferEURUSD"
                        value={calculationParams.bufferEURUSD}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Margen para variaciones de cambio</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Buffer USD/CLP (%)
                      </label>
                      <input
                        type="text"
                        name="bufferUSDCLP"
                        value={calculationParams.bufferUSDCLP}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Margen para variaciones del dólar</p>
                    </div>
                  </div>
                </div>
                
                {/* Transporte y Seguro */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="font-medium mb-4">Transporte y Seguro</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Buffer Transporte (%)
                      </label>
                      <input
                        type="text"
                        name="bufferTransporte"
                        value={calculationParams.bufferTransporte}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Margen para costos de transporte</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tasa Seguro (%)
                      </label>
                      <input
                        type="text"
                        name="tasaSeguro"
                        value={calculationParams.tasaSeguro}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Porcentaje para costos de seguro</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Fecha Última Actualización
                      </label>
                      <input
                        type="date"
                        name="fechaUltimaActualizacion"
                        value={calculationParams.fechaUltimaActualizacion}
                        onChange={handleParamChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Fecha de actualización de precios</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'configuracion' && (
          <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Configuración del Sistema</h2>
            <p className="text-gray-600">Este panel está en desarrollo. Aquí se podrán configurar aspectos generales del sistema.</p>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Registro de Actividad</h2>
            <p className="text-gray-600">Este panel está en desarrollo. Aquí se mostrarán los registros de actividad del sistema.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;