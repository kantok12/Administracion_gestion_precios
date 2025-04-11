import React from 'react';
import { X, FileSpreadsheet } from 'lucide-react';

interface DetallesUsuarioProps {
  onVolver: () => void;
  onFinalizar: () => void;
  productoPrincipal?: any;
  opcionalesSeleccionados?: any[];
  datosEnvio?: any;
  datosTributarios?: any;
}

const DetallesUsuario: React.FC<DetallesUsuarioProps> = ({
  onVolver,
  onFinalizar,
}) => {
  const exportarAExcel = () => {
    // Crear datos exactos del resumen de cálculos mostrado
    const datosExactos = {
      resumenCalculos: {
        productoPrincipal: {
          nombre: "Chipeadora PTO A141XL - 3 Puntos de enlace - Cat.II - Abertura 410 x 300mm",
          precioBase: "35.400,00 €",
          precioFinal: "40.356,00 €"
        },
        opcionales: [
          {
            nombre: "Opcional: Eje PTO con Disco Volante de Inercia para Chipeadora A141XL - PTO",
            precioFinal: "792,30 €"
          },
          {
            nombre: "Opcional: Eje PTO con Disco Volante de Inercia y Embrague para Chipeadora A141XL - PTO",
            precioFinal: "2234,40 €"
          },
          {
            nombre: "Opcional: Tablero de Luz para Chipeadora Remolcable 530XL/A540/A425/A328/A231/A141XL - PTO",
            precioFinal: "803,70 €"
          }
        ],
        subtotales: {
          subtotalBase: "38.760,00 €",
          conMargen: "46.512,00 €",
          descuento: "-2325,60 €",
          totalFinalEUR: "44.186,40 €",
          totalFinalCLP: "41.977.080,00 CLP"
        },
        costosEnvio: {
          costoBase: "2500,00 €",
          costoVariable: "1938,00 €",
          seguro: "387,60 €",
          totalEnvio: "4438,00 €"
        },
        impuestos: {
          baseImponible: "44.186,40 €",
          iva: "8395,42 €"
        },
        totales: {
          totalFinalEUR: "57.019,82 €",
          totalFinalCLP: "54.168.825,20 CLP"
        },
        metadata: {
          fechaGeneracion: "11/4/2025, 12:21:58",
          idCotizacion: "CONF-17443885187"
        }
      }
    };
    
    try {
      // Organizar datos en columnas en lugar de filas
      const columnas = [
        // Columna 1: Conceptos
        ['Resumen de Cálculos', '', 'Producto Principal:', datosExactos.resumenCalculos.productoPrincipal.nombre, 'Precio Base:', 'Precio Final:', '', 'Opcionales (3):', 
         datosExactos.resumenCalculos.opcionales[0].nombre, 'Precio Final:', 
         datosExactos.resumenCalculos.opcionales[1].nombre, 'Precio Final:', 
         datosExactos.resumenCalculos.opcionales[2].nombre, 'Precio Final:', '', 
         'Subtotales:', 'Subtotal Base:', 'Con Margen (20%):', 'Descuento (5%):', 'Total Final (EUR):', 'Total Final (CLP):', '', 
         'Costos de Envío:', 'Costo Base:', 'Costo Variable:', 'Seguro:', 'Total Envío:', '', 
         'Impuestos:', 'Base Imponible:', 'IVA (19%):', '', 
         'TOTAL FINAL (EUR):', 'TOTAL FINAL (CLP):', '', 
         `Configuracion generada: ${datosExactos.resumenCalculos.metadata.fechaGeneracion}`, 
         `ID: ${datosExactos.resumenCalculos.metadata.idCotizacion}`],
         
        // Columna 2: Valores
        ['', '', '', '', datosExactos.resumenCalculos.productoPrincipal.precioBase, datosExactos.resumenCalculos.productoPrincipal.precioFinal, '', '', 
         '', datosExactos.resumenCalculos.opcionales[0].precioFinal, 
         '', datosExactos.resumenCalculos.opcionales[1].precioFinal, 
         '', datosExactos.resumenCalculos.opcionales[2].precioFinal, '', 
         '', datosExactos.resumenCalculos.subtotales.subtotalBase, datosExactos.resumenCalculos.subtotales.conMargen, 
         datosExactos.resumenCalculos.subtotales.descuento, datosExactos.resumenCalculos.subtotales.totalFinalEUR, 
         datosExactos.resumenCalculos.subtotales.totalFinalCLP, '', 
         '', datosExactos.resumenCalculos.costosEnvio.costoBase, datosExactos.resumenCalculos.costosEnvio.costoVariable, 
         datosExactos.resumenCalculos.costosEnvio.seguro, datosExactos.resumenCalculos.costosEnvio.totalEnvio, '', 
         '', datosExactos.resumenCalculos.impuestos.baseImponible, datosExactos.resumenCalculos.impuestos.iva, '', 
         datosExactos.resumenCalculos.totales.totalFinalEUR, datosExactos.resumenCalculos.totales.totalFinalCLP, '', '', '']
      ];

      // Transponer las columnas a filas para CSV
      const filas = [];
      for (let i = 0; i < columnas[0].length; i++) {
        filas.push([columnas[0][i], columnas[1][i]]);
      }
      
      // Convertir filas a CSV
      let csv = filas.map(fila => fila.join(',')).join('\n');
      
      // Crear y descargar el archivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Extraer número de la ID de cotización para el nombre de archivo
      const idNumber = datosExactos.resumenCalculos.metadata.idCotizacion.split('-')[1];
      const configNumber = parseInt(idNumber) % 10000; // Usar los últimos dígitos como número de configuración
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `CONFIGURACION-${configNumber}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Datos exactos exportados a Excel en formato columnar');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Hubo un error al exportar los datos. Por favor intente nuevamente.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700">Exportar Resumen de Configuracion</h2>
        <button onClick={onVolver} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Exportar Resumen de Configuracion</h3>
          <p className="text-gray-600">Haga clic en el botón para exportar el resumen de configuracion exactamente como se muestra</p>
        </div>
        
        {/* Export button */}
        <div className="w-full max-w-md">
          <button
            onClick={exportarAExcel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5" />
            Exportar Resumen de Configuracion a Excel
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Exporta exactamente los datos del resumen de configuracion sin modificaciones
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 w-full flex justify-center">
          <button
            onClick={onFinalizar}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesUsuario; 