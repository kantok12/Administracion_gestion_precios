import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import ProcesoCompra from './components/cotizacion/ProcesoCompra';
import LogoEcoAlliance from './components/LogoEcoAlliance';

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

interface LocationState {
  productoPrincipal: Producto;
  opcionalesSeleccionados: Opcional[];
}

export default function Cotizacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<LocationState | null>(null);
  const [opcionalesSeleccionados, setOpcionalesSeleccionados] = useState<Opcional[]>([]);
  const [cotizacionCompletada, setCotizacionCompletada] = useState(false);
  const [cotizacionId, setCotizacionId] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si tenemos los datos necesarios en location.state
    if (location.state && 
        'productoPrincipal' in location.state && 
        'opcionalesSeleccionados' in location.state) {
      setState(location.state as LocationState);
      setOpcionalesSeleccionados((location.state as LocationState).opcionalesSeleccionados);
    } else {
      // Redireccionar si no hay datos
      navigate('/equipos');
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate('/equipos');
  };

  const handleComplete = () => {
    // Generar un ID único para la cotización
    const id = `COT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    setCotizacionId(id);
    setCotizacionCompletada(true);
  };

  const handleUpdateOpcionales = (opcionales: Opcional[]) => {
    setOpcionalesSeleccionados(opcionales);
    // Si quieres actualizar también el estado principal:
    if (state) {
      setState({
        ...state,
        opcionalesSeleccionados: opcionales
      });
    }
  };

  if (!state) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (cotizacionCompletada) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <LogoEcoAlliance className="h-10" />
            <Link to="/equipos" className="text-sm text-gray-600 hover:text-gray-900">
              Volver a Equipos
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">¡Cotización Completada!</h2>
            <p className="text-gray-600 mb-6">
              Tu cotización ha sido enviada correctamente. Hemos registrado tu solicitud y nos pondremos en contacto contigo a la brevedad.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
              <h3 className="text-blue-800 font-medium mb-4 text-lg">Detalles de la cotización</h3>
              
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-blue-200 font-mono text-xl font-bold text-blue-700">
                  {cotizacionId}
                </div>
              </div>
              
              <div className="text-left border-t border-blue-200 pt-4 mt-2">
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Producto:</span> 
                  <span className="ml-2">{state?.productoPrincipal.nombre_del_producto}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Código:</span> 
                  <span className="ml-2 font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">{state?.productoPrincipal.codigo_producto}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Precio:</span> 
                  <span className="ml-2 font-medium text-blue-700">{state?.productoPrincipal.pf_eur ? `€${state.productoPrincipal.pf_eur}` : '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Opcionales:</span> 
                  <span className="ml-2">{opcionalesSeleccionados.length} seleccionados</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link
                to="/equipos"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver a Equipos
              </Link>
              <button
                onClick={() => {
                  // En un caso real, aquí se abriría una ventana para descargar la cotización
                  alert('Descargando cotización...');
                }}
                className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Descargar Cotización
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex items-center max-w-6xl mx-auto">
          <button 
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Crear Cotización</h1>
        </div>
      </header>

      <main className="flex-1">
        <ProcesoCompra
          productoPrincipal={state.productoPrincipal}
          opcionalesSeleccionados={opcionalesSeleccionados}
          onClose={handleBack}
          onComplete={handleComplete}
          onUpdateOpcionales={handleUpdateOpcionales}
        />
      </main>
    </div>
  );
} 