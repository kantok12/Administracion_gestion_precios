import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  BarChart3,
  BarChart2,
  Settings,
  Bell,
  User,
  Lock,
  Globe,
  Mail,
  Save,
  X,
  CheckCircle,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoEcoAlliance from './components/LogoEcoAlliance';

interface ConfiguracionUsuario {
  nombre: string;
  email: string;
  idioma: string;
  notificaciones: boolean;
  tema: string;
}

export default function Configuracion() {
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de datos
  const [configuracion, setConfiguracion] = useState<ConfiguracionUsuario>({
    nombre: '',
    email: '',
    idioma: 'Español',
    notificaciones: true,
    tema: 'Claro',
  });

  const [configuracionOriginal, setConfiguracionOriginal] = useState<ConfiguracionUsuario | null>(null);
  const [mostrarGuardado, setMostrarGuardado] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Datos simulados
        const datosSimulados: ConfiguracionUsuario = {
          nombre: 'Usuario Demo',
          email: 'usuario@ejemplo.com',
          idioma: 'Español',
          notificaciones: true,
          tema: 'Claro',
        };
        
        setConfiguracion(datosSimulados);
        setConfiguracionOriginal(datosSimulados);
      } catch (err) {
        setError('Error al cargar la configuración. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarConfiguracion();
  }, []);

  // Detectar cambios para habilitar/deshabilitar botón guardar
  const hayCambios = () => {
    if (!configuracionOriginal) return false;
    return JSON.stringify(configuracion) !== JSON.stringify(configuracionOriginal);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    
    try {
      // Simular guardado en la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar configuración original
      setConfiguracionOriginal(configuracion);
      
      // Mostrar mensaje de éxito
      setMostrarGuardado(true);
      setTimeout(() => setMostrarGuardado(false), 3000);
    } catch (err) {
      setError('Error al guardar la configuración. Intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    if (configuracionOriginal) {
      setConfiguracion(configuracionOriginal);
    }
  };

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
        </nav>
        
        {/* Botón de configuración en la parte inferior */}
        <div className="pt-2 border-t mt-auto">
          <Link
            to="/configuracion"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600"
          >
            <Settings className="h-4 w-4" />
            CONFIGURACIÓN
          </Link>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 p-4 flex flex-col max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">CONFIGURACIÓN</h2>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Pantalla de carga */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin">
              <Loader className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm">Cargando configuración...</p>
          </div>
        ) : (
          <>
            {/* Secciones de Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Perfil de Usuario */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-semibold">Perfil de Usuario</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={configuracion.nombre}
                      onChange={(e) => setConfiguracion({...configuracion, nombre: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={configuracion.email}
                      onChange={(e) => setConfiguracion({...configuracion, email: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preferencias */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-semibold">Preferencias</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idioma
                    </label>
                    <select
                      value={configuracion.idioma}
                      onChange={(e) => setConfiguracion({...configuracion, idioma: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Español">Español</option>
                      <option value="English">English</option>
                      <option value="Português">Português</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tema
                    </label>
                    <select
                      value={configuracion.tema}
                      onChange={(e) => setConfiguracion({...configuracion, tema: e.target.value})}
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Claro">Claro</option>
                      <option value="Oscuro">Oscuro</option>
                      <option value="Sistema">Sistema</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notificaciones */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-semibold">Notificaciones</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Activar notificaciones
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.notificaciones}
                        onChange={(e) => setConfiguracion({...configuracion, notificaciones: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia de notificaciones
                    </label>
                    <select
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={!configuracion.notificaciones}
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-semibold">Seguridad</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones Guardar/Cancelar */}
            <div className="mt-4 flex justify-end gap-2">
              {hayCambios() && (
                <button
                  onClick={handleCancelar}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={guardando}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGuardar}
                className={`px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors ${(!hayCambios() || guardando) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hayCambios() || guardando}
              >
                {guardando ? (
                  <>
                    <Loader className="h-3 w-3 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Mensaje de guardado exitoso */}
        {mostrarGuardado && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 text-sm rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="h-4 w-4" />
            <span>Cambios guardados correctamente</span>
          </div>
        )}
      </main>
    </div>
  );
} 