# Integración Backend con Sección de Detalles Tributarios

Este documento explica cómo se integra el backend de cálculo de precios con la sección de Detalles Tributarios del frontend.

## Descripción General

La sección de Detalles Tributarios es parte del proceso de compra y permite configurar:

1. Parámetros de cálculo (markup, descuento, tasa de cambio)
2. Tipo de documento y condiciones de pago
3. Impuestos aplicables y moneda
4. Configuración de envío (puertos de origen y destino)

El componente realiza cálculos en tiempo real usando ya sea:
- Llamadas al backend (producción)
- Cálculos locales (desarrollo)

## Estructura

### Componente Frontend
- `src/components/cotizacion/DetallesTributarios.tsx`: Componente principal que muestra la interfaz y realiza cálculos
- `src/components/cotizacion/ProcesoCompra.tsx`: Componente que integra los distintos pasos y provee los datos

### Backend
- `backend/api.py`: API REST con endpoint `/api/cotizacion` para calcular precios
- `backend/price_calculation.py`: Lógica de cálculo de precios y generación de cotizaciones
- `backend/test_frontend_integration.py`: Servidor mock para pruebas de integración

## Flujo de Datos

1. El componente `ProcesoCompra` pasa los datos del producto y opcionales al componente `DetallesTributarios`
2. El usuario configura parámetros en la interfaz de `DetallesTributarios`
3. Al cambiar parámetros, se llama a la función `calcularCotizacion()`
4. La función envía datos al backend mediante una solicitud POST a `/api/cotizacion`
5. El backend calcula precios, impuestos, envíos y devuelve una cotización completa
6. El componente muestra los resultados en tiempo real

## Datos Calculados

El backend devuelve una estructura completa con:

- Precios del producto principal (base, con markup, con descuento)
- Precios de opcionales
- Costos de envío
- Impuestos aplicables según tipo de documento
- Totales en EUR y moneda local
- ID de cotización y metadatos

## Cómo Probar

### 1. Probar con el Backend Completo

```bash
# Terminal 1: Iniciar el backend
cd backend
python run.py api

# Terminal 2: Iniciar el frontend (según la configuración de tu proyecto)
npm run dev
```

### 2. Probar con el Servidor Mock

```bash
# Iniciar servidor de prueba para integración
cd backend
python test_frontend_integration.py
```

### 3. Probar Solo el Cálculo Local

El componente tiene implementado un modo de simulación local que no requiere backend.
Para usarlo, asegúrate de que el comentario en la función `calcularCotizacion()` esté activo.

## Personalización

### Cambiar las Fórmulas de Cálculo

Las fórmulas principales están definidas en `backend/price_calculation.py`:

```python
# Precio con markup
precio_con_markup = precio_base * (1 + markup_percentage / 100)

# Precio con descuento
precio_final = precio_con_markup * (1 - discount_percentage / 100)

# Precio en moneda local
precio_local = precio_final * exchange_rate
```

### Agregar Nuevos Campos

Para agregar nuevos campos de cálculo:

1. Modificar la interfaz en `DetallesTributarios.tsx`
2. Actualizar el estado `formData` con los nuevos campos
3. Agregar los nuevos campos al objeto de solicitud `requestData`
4. Modificar `price_calculation.py` para usar los nuevos campos

## Dependencias

- Frontend: React, TailwindCSS, Lucide Icons
- Backend: Flask, Requests

## Notas Importantes

- En modo de desarrollo, se utiliza un cálculo local para simular el backend
- En producción, descomentar el código para realizar fetch al backend real
- Los cálculos de impuestos se basan en el tipo de IVA seleccionado (nacional: 19%, exportación: 0%) 