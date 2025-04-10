import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DetallesTributariosProps {
  onVolver: () => void;
  onSiguiente: () => void;
}

const DetallesTributarios: React.FC<DetallesTributariosProps> = ({
  onVolver,
  onSiguiente
}) => {
  const [formData, setFormData] = useState({
    tipoDocumento: 'factura',
    condicionPago: '30dias',
    tipoIva: 'nacional',
    moneda: 'clp'
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">Tax Details</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="factura">Invoice</option>
              <option value="boleta">Receipt</option>
              <option value="otro">Other</option>
            </select>
          </div>

          {/* Payment Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <select
              name="condicionPago"
              value={formData.condicionPago}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contado">Cash</option>
              <option value="30dias">30 days</option>
              <option value="60dias">60 days</option>
              <option value="90dias">90 days</option>
            </select>
          </div>

          {/* Tax Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Type
            </label>
            <select
              name="tipoIva"
              value={formData.tipoIva}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="nacional">National</option>
              <option value="exento">Exempt</option>
              <option value="exportacion">Export</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="clp">Chilean Peso (CLP)</option>
              <option value="usd">US Dollar (USD)</option>
              <option value="eur">Euro (EUR)</option>
              <option value="uf">Unidad de Fomento (UF)</option>
            </select>
          </div>
        </div>

        {/* Tax Information */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tax Information</h3>
          <p className="text-sm text-blue-700">
            The applicable tax rate will be determined based on the document type and tax type selected.
            For exempt operations or exports, the rate will be 0%.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={onSiguiente}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesTributarios; 