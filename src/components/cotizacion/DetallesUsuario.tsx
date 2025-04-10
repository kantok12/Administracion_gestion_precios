import React, { useState } from 'react';
import { X, ChevronLeft, CheckCircle } from 'lucide-react';

interface DetallesUsuarioProps {
  onVolver: () => void;
  onFinalizar: () => void;
}

const DetallesUsuario: React.FC<DetallesUsuarioProps> = ({
  onVolver,
  onFinalizar
}) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    rut: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    email: '',
    telefono: '',
    observaciones: ''
  });

  const [formErrors, setFormErrors] = useState({
    nombreCliente: false,
    rut: false,
    email: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = () => {
    // Simple validation
    const errors = {
      nombreCliente: formData.nombreCliente.trim() === '',
      rut: formData.rut.trim() === '',
      email: formData.email.trim() === ''
    };

    setFormErrors(errors);

    // If no errors, continue
    if (!Object.values(errors).some(error => error)) {
      onFinalizar();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">User Details</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name / Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.nombreCliente ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.nombreCliente && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="Ex: 12.345.678-9"
              className={`w-full px-3 py-2 border ${formErrors.rut ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.rut && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notes - Field that spans both columns */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional details for this quote..."
            ></textarea>
          </div>
        </div>

        {/* Required fields notice */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
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
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Finalize Quote
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesUsuario; 