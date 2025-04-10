import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Percent, MapPin, Ship } from 'lucide-react';

interface DetallesEnvioProps {
  onVolver: () => void;
  onSiguiente: () => void;
}

const DetallesEnvio: React.FC<DetallesEnvioProps> = ({
  onVolver,
  onSiguiente
}) => {
  const [formData, setFormData] = useState({
    puertoOrigen: '',
    puertoDestino: '',
    descuento: '0',
    notasEnvio: ''
  });

  const puertosOrigen = [
    // Puertos de Alemania
    { id: 'hamburg', nombre: 'Hamburg' },
    { id: 'lubeck', nombre: 'LUBECK' },
    { id: 'brunsbuettel', nombre: 'BRUNSBUETTEL' },
  ];

  const puertosDestino = [
    { id: 'valparaiso', nombre: 'Valparaíso' },
    { id: 'sanantonio', nombre: 'San Antonio' },
    { id: 'iquique', nombre: 'Iquique' },
    { id: 'antofagasta', nombre: 'Antofagasta' },
    { id: 'talcahuano', nombre: 'Talcahuano' },
    { id: 'puertomontt', nombre: 'Puerto Montt' },
    { id: 'puntaarenas', nombre: 'Punta Arenas' }
  ];

  const descuentos = [
    { id: '0', nombre: 'Sin descuento' },
    { id: '5', nombre: '5%' },
    { id: '10', nombre: '10%' },
    { id: '15', nombre: '15%' },
    { id: '20', nombre: '20%' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">Detalles de Envío</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Puerto de Origen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Ship className="h-4 w-4 mr-1 text-blue-600" />
              Puerto de Origen
            </label>
            <select
              name="puertoOrigen"
              value={formData.puertoOrigen}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un puerto</option>
              {puertosOrigen.map(puerto => (
                <option key={puerto.id} value={puerto.id}>
                  {puerto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Puerto de Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
              Puerto de Destino
            </label>
            <select
              name="puertoDestino"
              value={formData.puertoDestino}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un puerto</option>
              {puertosDestino.map(puerto => (
                <option key={puerto.id} value={puerto.id}>
                  {puerto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Percent className="h-4 w-4 mr-1 text-blue-600" />
              Descuento Aplicable
            </label>
            <select
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {descuentos.map(descuento => (
                <option key={descuento.id} value={descuento.id}>
                  {descuento.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas de Envío */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              name="notasEnvio"
              value={formData.notasEnvio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Información adicional sobre el envío..."
            ></textarea>
          </div>
        </div>

        {/* Información de Envío */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Información de Envío</h3>
          <p className="text-sm text-blue-700">
            Los costos de envío se calcularán en función de los puertos seleccionados y la distancia entre ellos.
            Los descuentos aplicados se reflejarán en el precio final de la cotización.
          </p>
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

export default DetallesEnvio; 