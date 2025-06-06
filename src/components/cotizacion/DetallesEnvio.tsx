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

  const enviarDatosProductos = async (productos: { codigo: string, tipo: string, precioEur: number }[]) => {
    try {
      // Crear la cadena de consulta con los productos
      const productoQuery = productos.map(p => `codigo=${p.codigo}&tipo=${p.tipo}&precioEur=${p.precioEur}`).join('&');
      
      // Agregar los puertos seleccionados y el descuento a la consulta
      const puertoOrigenQuery = `puertoOrigen=${formData.puertoOrigen}`;
      const puertoDestinoQuery = `puertoDestino=${formData.puertoDestino}`;
      const descuentoQuery = `descuento=${formData.descuento}`;
      
      // Combinar todo en una sola URL
      const url = `https://n8n-807184488368.southamerica-west1.run.app/webhook/ceec46e2-1fa3-4f9b-94bb-a974bc439bf6?${productoQuery}&${puertoOrigenQuery}&${puertoDestinoQuery}&${descuentoQuery}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      console.log('Datos enviados exitosamente al webhook:', url);
    } catch (err) {
      console.error('Error al enviar datos al webhook:', err);
      throw err; // Re-lanzar el error para que pueda ser capturado por el botón
    }
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
            onClick={async () => {
              try {
                // Validar que los puertos estén seleccionados
                if (!formData.puertoOrigen || !formData.puertoDestino) {
                  alert('Por favor seleccione los puertos de origen y destino');
                  return;
                }
                
                await enviarDatosProductos([
                  { codigo: '61502', tipo: 'principal', precioEur: 30770 },
                  { codigo: '61512', tipo: 'opcional', precioEur: 765 },
                  { codigo: '61507', tipo: 'opcional', precioEur: 2850 },
                  { codigo: '61578', tipo: 'opcional', precioEur: 800 },
                ]);
                
                // Obtener los nombres de puertos para mostrar mensaje más amigable
                const origenNombre = puertosOrigen.find(p => p.id === formData.puertoOrigen)?.nombre || formData.puertoOrigen;
                const destinoNombre = puertosDestino.find(p => p.id === formData.puertoDestino)?.nombre || formData.puertoDestino;
                
                alert(`Datos enviados exitosamente!\nPuerto origen: ${origenNombre}\nPuerto destino: ${destinoNombre}`);
                onSiguiente();
              } catch (error) {
                alert('Error al enviar los datos');
              }
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Botón para pruebas explícitas */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Herramientas de prueba</h3>
          <button
            onClick={async () => {
              try {
                // Datos de ejemplo para prueba
                if (!formData.puertoOrigen || !formData.puertoDestino) {
                  alert('Por favor seleccione los puertos de origen y destino para la prueba');
                  return;
                }

                await enviarDatosProductos([
                  { codigo: '61502', tipo: 'principal', precioEur: 30770 },
                  { codigo: '61512', tipo: 'opcional', precioEur: 765 },
                  { codigo: '61507', tipo: 'opcional', precioEur: 2850 },
                  { codigo: '61578', tipo: 'opcional', precioEur: 800 },
                ]);

                console.log('Prueba enviada con éxito');
                console.log('Datos enviados:', {
                  productos: [
                    { codigo: '61502', tipo: 'principal', precioEur: 30770 },
                    { codigo: '61512', tipo: 'opcional', precioEur: 765 },
                    { codigo: '61507', tipo: 'opcional', precioEur: 2850 },
                    { codigo: '61578', tipo: 'opcional', precioEur: 800 },
                  ],
                  puertoOrigen: formData.puertoOrigen,
                  puertoDestino: formData.puertoDestino,
                  descuento: formData.descuento
                });
                
                alert('Prueba ejecutada con éxito. Revisa la consola para más detalles.');
              } catch (error) {
                console.error('Error en la prueba:', error);
                alert('Error al ejecutar la prueba. Revisa la consola para más detalles.');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Ejecutar Prueba de Webhook
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesEnvio; 