# Backend de Cálculo de Precios para Configuraciones

Este backend implementa la lógica de cálculo de precios basado en el precio base, margen de beneficio, descuentos y costos de envío, integrándose con el sistema de webhooks existente.

## Características

- Cálculo de precios con markup y descuento
- Conversión de divisas (EUR a moneda local)
- Cálculo de costos de envío basado en peso, volumen y rutas
- Generación de cotizaciones completas
- Proxy para los webhooks existentes del sistema

## Estructura del Proyecto

```
backend/
├── api.py                # API REST con Flask
├── price_calculation.py  # Lógica de cálculo de precios
├── requirements.txt      # Dependencias del proyecto
├── README.md             # Este archivo
└── cotizaciones/         # Directorio para almacenar las cotizaciones generadas
```

## Requisitos

- Python 3.8 o superior
- Dependencias listadas en `requirements.txt`

## Instalación

1. Crea un entorno virtual (opcional pero recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

## Uso

### Iniciar el servidor

```bash
python api.py
```

El servidor estará disponible en `http://localhost:5000`.

### Endpoints disponibles

- **`GET /health`**: Verificar que la API está funcionando.
- **`POST /api/calculate`**: Calcular precio con markup y descuento.
- **`POST /api/exchange`**: Convertir precios según tasa de cambio.
- **`POST /api/shipping`**: Calcular costos de envío.
- **`POST /api/cotizacion`**: Generar una cotización completa.
- **`GET/POST /api/webhook-proxy/<webhook_type>`**: Proxy para los webhooks existentes.

### Ejemplos de uso

#### Calcular precio con markup y descuento

```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"base_price": 100, "markup": 20, "discount": 5}'
```

#### Generar una cotización completa

```bash
curl -X POST http://localhost:5000/api/cotizacion \
  -H "Content-Type: application/json" \
  -d '{
    "productoPrincipal": {
      "codigo_producto": "A141XL",
      "nombre_del_producto": "Chipeadora PTO A141XL",
      "pf_eur": "22500"
    },
    "opcionalesSeleccionados": [
      {
        "codigo_producto": "16521",
        "nombre_del_producto": "Eje PTO con Disco Volante",
        "pf_eur": "1250"
      }
    ],
    "markup": 18.5,
    "descuento": 3.0,
    "tasaCambio": 950.0,
    "puertoOrigen": "valencia",
    "puertoDestino": "valparaiso"
  }'
```

## Integración con el Frontend

Este backend está diseñado para integrarse con el frontend existente de la siguiente manera:

1. **Reemplazo directo de los webhooks**: El endpoint `/api/webhook-proxy/<webhook_type>` puede utilizarse como sustituto directo de los webhooks actuales, manteniendo la misma firma de API pero enriqueciendo los resultados.

2. **Nuevos endpoints para cálculos avanzados**: Los endpoints como `/api/cotizacion` ofrecen funcionalidad adicional que puede ser consumida por el frontend.

### Modificaciones requeridas en el frontend

Para integrar este backend con el frontend existente:

1. Modificar las URLs de los webhooks en el archivo `src/App.tsx` para que apunten a este backend:

```typescript
const WEBHOOK_URL_PRINCIPAL = 'http://localhost:5000/api/webhook-proxy/principal';
const WEBHOOK_URL_OPCIONALES = 'http://localhost:5000/api/webhook-proxy/opcionales';
// Etc.
```

2. Para usar la funcionalidad de cotización avanzada, modificar la función `handleCalcular` en el componente App para que utilice el nuevo endpoint:

```typescript
// En lugar de hacer el fetch directamente al webhook de cotización
// hacer una llamada al nuevo endpoint
fetch('http://localhost:5000/api/cotizacion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productoPrincipal: productoSeleccionado,
    opcionalesSeleccionados: selectedOpcionales,
    // Otros parámetros como markup, descuento, etc.
  })
})
```

## Fórmulas utilizadas

- **Precio con markup**: `precio_base * (1 + markup_percentage / 100)`
- **Precio con descuento**: `precio_con_markup * (1 - discount_percentage / 100)`
- **Precio en moneda local**: `precio_eur * exchange_rate`

## Desarrollo futuro

- Implementar almacenamiento persistente (base de datos)
- Añadir autenticación y autorización
- Implementar interfaz de administración para configurar parámetros
- Añadir más opciones de cálculo de costos de envío 