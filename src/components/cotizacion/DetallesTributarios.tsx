import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calculator, DollarSign, Euro, AlertCircle, Loader2 } from 'lucide-react';

interface DetallesTributariosProps {
  onVolver: () => void;
  onSiguiente: () => void;
  productoPrincipal?: any;
  opcionalesSeleccionados?: any[];
}

const DetallesTributarios: React.FC<DetallesTributariosProps> = ({
  onVolver,
  onSiguiente,
  productoPrincipal,
  opcionalesSeleccionados = []
}) => {
  const [formData, setFormData] = useState({
    tipoDocumento: 'factura',
    condicionPago: '30dias',
    tipoIva: 'nacional',
    moneda: 'clp',
    markup: 20,
    descuento: 5,
    tasaCambio: 950.0,
    puertoOrigen: 'valencia',
    puertoDestino: 'valparaiso'
  });

  const [cotizacion, setCotizacion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular cotización al iniciar el componente y al cambiar los parámetros
  useEffect(() => {
    if (productoPrincipal && opcionalesSeleccionados) {
      calcularCotizacion();
    }
  }, [productoPrincipal, opcionalesSeleccionados, formData.markup, formData.descuento, formData.tasaCambio, formData.tipoIva, formData.moneda]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir a número si es un campo numérico
    if (['markup', 'descuento', 'tasaCambio'].includes(name)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({
          ...prev,
          [name]: numValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calcularCotizacion = async () => {
    if (!productoPrincipal) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Calcular cotización localmente usando las mismas fórmulas que el backend
      const precioBase = parseFloat(productoPrincipal.pf_eur || "0");
      const preciosOpcionales = opcionalesSeleccionados.map(opt => parseFloat(opt.pf_eur || "0"));
      const subtotalEur = precioBase + preciosOpcionales.reduce((a, b) => a + b, 0);
      
      // Aplicar markup y descuento
      const totalConMarkupEur = subtotalEur * (1 + formData.markup / 100);
      const descuentoAplicadoEur = totalConMarkupEur * (formData.descuento / 100);
      const totalFinalEur = totalConMarkupEur - descuentoAplicadoEur;
      
      // Calcular en moneda local
      const totalFinalLocal = totalFinalEur * formData.tasaCambio;
      
      // Calcular costos de envío (simplificado)
      const costoEnvioBase = 2500; // Valor base EUR
      const costoEnvioAdicional = subtotalEur * 0.05; // 5% del valor
      const costoEnvioTotal = costoEnvioBase + costoEnvioAdicional;
      
      // Calcular impuestos
      const impuestosPorcentaje = formData.tipoIva === 'nacional' ? 19 : 
                                formData.tipoIva === 'exportacion' ? 0 : 0;
      const impuestosEur = totalFinalEur * (impuestosPorcentaje / 100);
      
      // Generar cotización simulada
      const cotizacionSimulada = {
        fecha: new Date().toISOString(),
        id_cotizacion: `COT-${Date.now()}`,
        producto_principal: {
          codigo: productoPrincipal.codigo_producto,
          nombre: productoPrincipal.nombre_del_producto,
          precio_base_eur: precioBase,
          precio_final_eur: precioBase * (1 + formData.markup/100) * (1 - formData.descuento/100),
          precio_final_local: precioBase * (1 + formData.markup/100) * (1 - formData.descuento/100) * formData.tasaCambio
        },
        opcionales: opcionalesSeleccionados.map(opt => ({
          codigo: opt.codigo_producto,
          nombre: opt.nombre_del_producto,
          precio_base_eur: parseFloat(opt.pf_eur || "0"),
          precio_final_eur: parseFloat(opt.pf_eur || "0") * (1 + formData.markup/100) * (1 - formData.descuento/100),
          precio_final_local: parseFloat(opt.pf_eur || "0") * (1 + formData.markup/100) * (1 - formData.descuento/100) * formData.tasaCambio
        })),
        totales: {
          subtotal_eur: subtotalEur,
          total_con_markup_eur: totalConMarkupEur,
          descuento_aplicado_eur: descuentoAplicadoEur,
          total_final_eur: totalFinalEur,
          total_final_local: totalFinalLocal,
          tasa_cambio_aplicada: formData.tasaCambio
        },
        envio: {
          costo_base: costoEnvioBase,
          costo_variable: costoEnvioAdicional,
          seguro: subtotalEur * 0.01, // 1% del valor
          impuestos: costoEnvioTotal * (impuestosPorcentaje / 100),
          costo_total: costoEnvioTotal
        },
        parametros: {
          markup_porcentaje: formData.markup,
          descuento_porcentaje: formData.descuento,
          puerto_origen: formData.puertoOrigen,
          puerto_destino: formData.puertoDestino,
          tipo_iva: formData.tipoIva,
          porcentaje_iva: impuestosPorcentaje
        },
        impuestos: {
          base_imponible_eur: totalFinalEur,
          porcentaje: impuestosPorcentaje,
          monto_eur: impuestosEur,
          monto_local: impuestosEur * formData.tasaCambio
        },
        gran_total_eur: totalFinalEur + costoEnvioTotal + impuestosEur,
        gran_total_local: (totalFinalEur + costoEnvioTotal + impuestosEur) * formData.tasaCambio
      };
      
      setCotizacion(cotizacionSimulada);
      
    } catch (err: any) {
      console.error("Error al calcular cotización:", err);
      setError("Error al realizar los cálculos. Por favor revise los datos ingresados.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number, currency: string = 'EUR') => {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : formData.moneda.toUpperCase(),
      minimumFractionDigits: 2
    });
    
    return formatter.format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">Detalles Tributarios y Cálculos</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Parámetros */}
          <div className="space-y-6">
            <h3 className="text-md font-medium text-gray-800 mb-3">Parámetros de Cálculo</h3>
            
            {/* Markup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margen (Markup %)
              </label>
              <input
                type="number"
                name="markup"
                value={formData.markup}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                step="0.5"
              />
            </div>
            
            {/* Descuento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descuento (%)
              </label>
              <input
                type="number"
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                step="0.5"
              />
            </div>
            
            {/* Tasa de Cambio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Cambio (EUR a {formData.moneda.toUpperCase()})
              </label>
              <input
                type="number"
                name="tasaCambio"
                value={formData.tasaCambio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="factura">Factura</option>
                <option value="boleta">Boleta</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Payment Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones de Pago
              </label>
              <select
                name="condicionPago"
                value={formData.condicionPago}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="contado">Contado</option>
                <option value="30dias">30 días</option>
                <option value="60dias">60 días</option>
                <option value="90dias">90 días</option>
              </select>
            </div>
          </div>
          
          {/* Columna 2: Más parámetros y resumen */}
          <div className="space-y-6">
            <h3 className="text-md font-medium text-gray-800 mb-3">Impuestos y Moneda</h3>
            
            {/* Tax Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de IVA
              </label>
              <select
                name="tipoIva"
                value={formData.tipoIva}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="nacional">Nacional (19%)</option>
                <option value="exento">Exento (0%)</option>
                <option value="exportacion">Exportación (0%)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="clp">Peso Chileno (CLP)</option>
                <option value="usd">Dólar Estadounidense (USD)</option>
                <option value="eur">Euro (EUR)</option>
                <option value="uf">Unidad de Fomento (UF)</option>
              </select>
            </div>
            
            {/* Puertos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puerto de Origen
              </label>
              <select
                name="puertoOrigen"
                value={formData.puertoOrigen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="valencia">Valencia</option>
                <option value="barcelona">Barcelona</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puerto de Destino
              </label>
              <select
                name="puertoDestino"
                value={formData.puertoDestino}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="valparaiso">Valparaíso</option>
                <option value="sanantonio">San Antonio</option>
              </select>
            </div>
            
            {/* Recalcular Button */}
            <button
              onClick={calcularCotizacion}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
              {loading ? 'Calculando...' : 'Recalcular'}
            </button>
          </div>
          
          {/* Columna 3: Resultados */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-md font-medium text-gray-800 mb-4">Resumen de Cálculos</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">Calculando...</span>
              </div>
            ) : cotizacion ? (
              <div className="space-y-4 text-sm">
                {/* Producto principal */}
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-700">Producto Principal:</p>
                  <p className="text-gray-600">{cotizacion.producto_principal.nombre}</p>
                  <div className="flex justify-between mt-1">
                    <span>Precio Base:</span>
                    <span className="font-medium">{formatCurrency(cotizacion.producto_principal.precio_base_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio Final:</span>
                    <span className="font-medium">{formatCurrency(cotizacion.producto_principal.precio_final_eur)}</span>
                  </div>
                </div>
                
                {/* Opcionales */}
                {cotizacion.opcionales.length > 0 && (
                  <div className="border-b pb-3">
                    <p className="font-medium text-gray-700">Opcionales ({cotizacion.opcionales.length}):</p>
                    {cotizacion.opcionales.map((opt: any, index: number) => (
                      <div key={index} className="mt-1">
                        <p className="text-gray-600 text-xs">{opt.nombre}</p>
                        <div className="flex justify-between">
                          <span>Precio Final:</span>
                          <span className="font-medium">{formatCurrency(opt.precio_final_eur)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Subtotales */}
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-700">Subtotales:</p>
                  <div className="flex justify-between">
                    <span>Subtotal Base:</span>
                    <span>{formatCurrency(cotizacion.totales.subtotal_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Con Margen ({formData.markup}%):</span>
                    <span>{formatCurrency(cotizacion.totales.total_con_markup_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descuento ({formData.descuento}%):</span>
                    <span>-{formatCurrency(cotizacion.totales.descuento_aplicado_eur)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Final (EUR):</span>
                    <span>{formatCurrency(cotizacion.totales.total_final_eur)}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-1">
                    <span>Total Final ({formData.moneda.toUpperCase()}):</span>
                    <span>{formatCurrency(cotizacion.totales.total_final_local, formData.moneda)}</span>
                  </div>
                </div>
                
                {/* Envío */}
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-700">Costos de Envío:</p>
                  <div className="flex justify-between">
                    <span>Costo Base:</span>
                    <span>{formatCurrency(cotizacion.envio.costo_base)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo Variable:</span>
                    <span>{formatCurrency(cotizacion.envio.costo_variable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seguro:</span>
                    <span>{formatCurrency(cotizacion.envio.seguro)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Envío:</span>
                    <span>{formatCurrency(cotizacion.envio.costo_total)}</span>
                  </div>
                </div>
                
                {/* Impuestos */}
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-700">Impuestos:</p>
                  <div className="flex justify-between">
                    <span>Base Imponible:</span>
                    <span>{formatCurrency(cotizacion.impuestos.base_imponible_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA ({cotizacion.impuestos.porcentaje}%):</span>
                    <span>{formatCurrency(cotizacion.impuestos.monto_eur)}</span>
                  </div>
                </div>
                
                {/* Gran Total */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex justify-between font-bold text-blue-800">
                    <span>TOTAL FINAL (EUR):</span>
                    <span>{formatCurrency(cotizacion.gran_total_eur)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-800 mt-1">
                    <span>TOTAL FINAL ({formData.moneda.toUpperCase()}):</span>
                    <span>{formatCurrency(cotizacion.gran_total_local, formData.moneda)}</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    <p>Cotización generada: {new Date(cotizacion.fecha).toLocaleString()}</p>
                    <p>ID: {cotizacion.id_cotizacion}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calculator className="h-12 w-12 mb-2 text-gray-400" />
                <p>Los cálculos aparecerán aquí</p>
                <button
                  onClick={calcularCotizacion}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calcular ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <button
            onClick={onSiguiente}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesTributarios; 