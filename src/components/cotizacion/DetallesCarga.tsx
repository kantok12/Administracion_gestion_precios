import React from 'react';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
  pf_eur?: string;
  transporte_nacional?: string;
}

interface Opcional {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  pf_eur?: string;
  transporte_nacional?: string;
}

interface DetallesCargaProps {
  codigoProducto: string;
  nombreProducto: string;
  descripcionProducto: string;
  opcionalesSeleccionados: Opcional[];
  onVolver: () => void;
  onSiguiente: () => void;
  onRemoveOpcional?: (codigo: string) => void;
  precioPrincipal?: string;
}

const DetallesCarga: React.FC<DetallesCargaProps> = ({
  codigoProducto,
  nombreProducto,
  descripcionProducto,
  opcionalesSeleccionados,
  onVolver,
  onSiguiente,
  onRemoveOpcional,
  precioPrincipal
}) => {
  // Función para manejar la eliminación de un opcional
  const handleRemoveOpcional = (codigo: string) => {
    if (onRemoveOpcional) {
      onRemoveOpcional(codigo);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">Detalles de la Carga</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Producto Principal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="bg-blue-600 text-white text-xs uppercase tracking-wider py-1 px-2 rounded-md mr-2">Principal</span>
            Producto Principal
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg overflow-hidden border border-blue-200">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider w-1/6">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider w-3/6">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider w-2/6">
                    Precio en EUR
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono bg-white text-blue-700 px-2 py-1 rounded border-l-2 border-blue-500 inline-block font-medium tracking-wider shadow-sm">
                      {codigoProducto}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {nombreProducto}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {precioPrincipal ? `€${precioPrincipal}` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Opcionales Seleccionados */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="bg-green-600 text-white text-xs uppercase tracking-wider py-1 px-2 rounded-md mr-2">Adicionales</span>
            Opcionales Seleccionados
            {opcionalesSeleccionados.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                {opcionalesSeleccionados.length} seleccionados
              </span>
            )}
          </h3>
          {opcionalesSeleccionados.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-gray-200 shadow-sm">
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 to-green-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/6 min-w-[100px]">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-3/6 min-w-[250px]">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider w-1/6 min-w-[100px]">
                        Precio en EUR
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-1/6 min-w-[80px] sticky right-0 bg-gradient-to-l from-gray-100 to-green-50">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opcionalesSeleccionados.map((opcional, index) => (
                      <tr key={opcional.codigo_producto} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono bg-green-50 text-green-700 px-2 py-1 rounded border-l-2 border-green-300 inline-block font-medium tracking-wider">
                            {opcional.codigo_producto}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {opcional.nombre_del_producto
                            .replace(/^Opcional: |^Opcional |Opcional de |Opcional: de /, '')
                            .replace(/^Chipeadora Chipeadora/, 'Chipeadora')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {opcional.pf_eur ? `€${opcional.pf_eur}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center sticky right-0 bg-white">
                          <button 
                            onClick={() => handleRemoveOpcional(opcional.codigo_producto)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            title="Eliminar opcional"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {opcionalesSeleccionados.length > 4 && (
                <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center">
                  <span>Desplácese horizontalmente si es necesario para ver todos los detalles</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
              <p className="text-gray-600">No se han seleccionado opcionales para este producto</p>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
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

export default DetallesCarga; 