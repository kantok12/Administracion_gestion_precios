// Archivo: src/Calculo.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Producto {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
  categoria?: string;
}

interface Opcional {
  codigo_producto: string;
  nombre_del_producto: string;
  Descripcion: string;
  Modelo: string;
}

export default function Calculo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { productoPrincipal, opcionalesSeleccionados } = location.state || {
    productoPrincipal: null,
    opcionalesSeleccionados: [],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      {/* Barra de Progreso */}
      <div className="flex justify-center space-x-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">1</div>
          <span className="text-sm mt-2 font-bold">Detalles de la Carga</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">2</div>
          <span className="text-sm mt-2">Detalles Tributarios</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">3</div>
          <span className="text-sm mt-2">Detalles Usuario</span>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Detalles de la Carga</h2>

        {/* Producto Principal */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Código Producto Principal:
          </label>
          <div className="p-4 border rounded bg-gray-100 text-gray-700">
            {productoPrincipal?.codigo_producto || "No seleccionado"}
          </div>
        </div>

        {/* Opcionales Seleccionados */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Opcionales Seleccionados:
          </label>
          {opcionalesSeleccionados && opcionalesSeleccionados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border bg-gray-100 rounded">
                <thead className="bg-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-2 border">Código</th>
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Descripción</th>
                    <th className="p-2 border">Modelo</th>
                  </tr>
                </thead>
                <tbody>
                  {opcionalesSeleccionados.map((opcional: Opcional, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 border">{opcional.codigo_producto}</td>
                      <td className="p-2 border">{opcional.nombre_del_producto}</td>
                      <td className="p-2 border">{opcional.Descripcion}</td>
                      <td className="p-2 border">{opcional.Modelo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 border rounded bg-gray-100 text-gray-700">
              No hay opcionales seleccionados.
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Volver
          </button>
          <button
            onClick={() => alert("Siguiente paso")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}