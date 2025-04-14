import React, { useState } from 'react';
import DetallesCarga from './DetallesCarga';
import DetallesEnvio from './DetallesEnvio';
import DetallesTributarios from './DetallesTributarios';
import DetallesUsuario from './DetallesUsuario';

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

interface ProcesoCompraProps {
  productoPrincipal: Producto;
  opcionalesSeleccionados: Opcional[];
  onClose: () => void;
  onComplete: () => void;
  onUpdateOpcionales?: (opcionales: Opcional[]) => void;
}

const ProcesoCompra: React.FC<ProcesoCompraProps> = ({
  productoPrincipal,
  opcionalesSeleccionados: initialOpcionales,
  onClose,
  onComplete,
  onUpdateOpcionales
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [opcionales, setOpcionales] = useState<Opcional[]>(initialOpcionales);
  
  // Pasos del proceso
  const pasos = [
    { id: 1, label: "Detalles de la Carga" },
    { id: 2, label: "Detalles de Envío" },
    { id: 3, label: "Detalles Tributarios" },
    { id: 4, label: "Detalles Usuario" }
  ];

  const handleNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, pasos.length));
  };

  const handlePrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleFinalizar = () => {
    // Si hay una función de actualización de opcionales, llamarla antes de completar
    if (onUpdateOpcionales) {
      onUpdateOpcionales(opcionales);
    }
    onComplete();
  };

  const handleRemoveOpcional = (codigo: string) => {
    const updatedOpcionales = opcionales.filter(opt => opt.codigo_producto !== codigo);
    setOpcionales(updatedOpcionales);
    
    // Si hay una función de actualización de opcionales, llamarla
    if (onUpdateOpcionales) {
      onUpdateOpcionales(updatedOpcionales);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Indicador de Pasos */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          {pasos.map((paso, index) => (
            <React.Fragment key={paso.id}>
              {/* Paso */}
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-medium ${
                    paso.id === currentStep ? 'bg-blue-600' : 
                    paso.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {paso.id}
                </div>
                <span className={`text-sm mt-2 ${
                  paso.id === currentStep ? 'font-bold' : 'font-normal'
                }`}>
                  {paso.label}
                </span>
              </div>
              
              {/* Línea conectora */}
              {index < pasos.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-300 relative">
                  {currentStep > index + 1 && (
                    <div className="absolute inset-0 bg-green-500" style={{ width: '100%' }}></div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenedor del paso actual */}
      <div className="flex-1 mb-8 px-4 max-w-6xl mx-auto w-full">
        {currentStep === 1 && (
          <DetallesCarga
            codigoProducto={productoPrincipal.codigo_producto}
            nombreProducto={productoPrincipal.nombre_del_producto}
            descripcionProducto={productoPrincipal.Descripcion}
            opcionalesSeleccionados={opcionales}
            onVolver={onClose}
            onSiguiente={handleNextStep}
            onRemoveOpcional={handleRemoveOpcional}
            precioPrincipal={productoPrincipal.pf_eur}
          />
        )}
        
        {currentStep === 2 && (
          <DetallesEnvio
            onVolver={handlePrevStep}
            onSiguiente={handleNextStep}
          />
        )}
        
        {currentStep === 3 && (
          <DetallesTributarios
            onVolver={handlePrevStep}
            onSiguiente={handleNextStep}
            productoPrincipal={productoPrincipal}
            opcionalesSeleccionados={opcionales}
          />
        )}
        
        {currentStep === 4 && (
          <DetallesUsuario
            onVolver={handlePrevStep}
            onFinalizar={handleFinalizar}
          />
        )}
      </div>
    </div>
  );
};

export default ProcesoCompra;