#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de prueba para la integración entre el frontend y backend
Específicamente enfocado en la sección de Detalles Tributarios
"""

import sys
import json
import logging
from datetime import datetime
import requests
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time
import os
import webbrowser

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend/logs/test_frontend_integration.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("test_frontend_integration")

# Configuración
API_BASE_URL = "http://localhost:5000"
FRONTEND_PORT = 5173  # Puerto típico para Vite
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

class CORSHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Manejador HTTP que agrega headers CORS"""
    
    def end_headers(self):
        for name, value in CORS_HEADERS.items():
            self.send_header(name, value)
        SimpleHTTPRequestHandler.end_headers(self)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def start_mock_server(port=5000):
    """Inicia un servidor HTTP simple para simular el backend"""
    
    class MockAPIHandler(CORSHTTPRequestHandler):
        def do_POST(self):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            
            if self.path == '/api/cotizacion':
                # Simular una respuesta de cotización
                logger.info(f"Recibida solicitud de cotización: {json.dumps(request_data, indent=2)}")
                
                producto_principal = request_data.get("productoPrincipal", {})
                opcionales = request_data.get("opcionalesSeleccionados", [])
                markup = float(request_data.get("markup", 20))
                descuento = float(request_data.get("descuento", 5))
                tasa_cambio = float(request_data.get("tasaCambio", 950))
                
                # Calcular precios
                precio_base = float(producto_principal.get("pf_eur", 0))
                precio_con_markup = precio_base * (1 + markup/100)
                precio_final = precio_con_markup * (1 - descuento/100)
                
                # Preparar respuesta
                response_data = {
                    "status": "success",
                    "cotizacion": {
                        "fecha": datetime.now().isoformat(),
                        "id_cotizacion": f"COT-{int(time.time())}",
                        "producto_principal": {
                            "codigo": producto_principal.get("codigo_producto", ""),
                            "nombre": producto_principal.get("nombre_del_producto", ""),
                            "precio_base_eur": precio_base,
                            "precio_final_eur": precio_final,
                            "precio_final_local": precio_final * tasa_cambio
                        },
                        "opcionales": [
                            {
                                "codigo": opt.get("codigo_producto", ""),
                                "nombre": opt.get("nombre_del_producto", ""),
                                "precio_base_eur": float(opt.get("pf_eur", 0)),
                                "precio_final_eur": float(opt.get("pf_eur", 0)) * (1 + markup/100) * (1 - descuento/100),
                                "precio_final_local": float(opt.get("pf_eur", 0)) * (1 + markup/100) * (1 - descuento/100) * tasa_cambio
                            } for opt in opcionales
                        ],
                        "totales": {
                            "subtotal_eur": precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales),
                            "total_con_markup_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100),
                            "descuento_aplicado_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (descuento/100),
                            "total_final_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100),
                            "total_final_local": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100) * tasa_cambio,
                            "tasa_cambio_aplicada": tasa_cambio
                        },
                        "impuestos": {
                            "base_imponible_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100),
                            "porcentaje": 19 if request_data.get("tipoIva") == "nacional" else 0,
                            "monto_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100) * (0.19 if request_data.get("tipoIva") == "nacional" else 0),
                            "monto_local": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100) * (0.19 if request_data.get("tipoIva") == "nacional" else 0) * tasa_cambio
                        },
                        "gran_total_eur": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100) * (1 + (0.19 if request_data.get("tipoIva") == "nacional" else 0)),
                        "gran_total_local": (precio_base + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)) * (1 + markup/100) * (1 - descuento/100) * (1 + (0.19 if request_data.get("tipoIva") == "nacional" else 0)) * tasa_cambio
                    }
                }
                
                # Enviar respuesta
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
            else:
                # Respuesta por defecto para otras rutas
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Ruta no encontrada"}).encode('utf-8'))
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, MockAPIHandler)
    logger.info(f"Iniciando servidor de prueba en puerto {port}...")
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    return httpd

def test_cotizacion_request():
    """Envía una solicitud de prueba al endpoint de cotización"""
    url = f"{API_BASE_URL}/api/cotizacion"
    
    # Datos de prueba
    data = {
        "productoPrincipal": {
            "codigo_producto": "A141XL",
            "nombre_del_producto": "Chipeadora PTO A141XL - 3 Puntos de enlace - Cat.II - Abertura 410 x 300mm",
            "Descripcion": "Chipeadora profesional con sistema de corte por disco",
            "Modelo": "A141XL",
            "pf_eur": "22500",
            "transporte_nacional": "1200"
        },
        "opcionalesSeleccionados": [
            {
                "codigo_producto": "16521",
                "nombre_del_producto": "Eje PTO con Disco Volante de Inercia para Chipeadora A141XL - PTO",
                "Descripcion": "Eje PTO reforzado con disco volante",
                "pf_eur": "1250"
            },
            {
                "codigo_producto": "16902",
                "nombre_del_producto": "Eje PTO con Disco Volante de Inercia y Embrague para Chipeadora A141XL - PTO",
                "Descripcion": "Eje PTO premium con embrague integrado",
                "pf_eur": "1850"
            }
        ],
        "markup": 18.5,
        "descuento": 3.0,
        "tasaCambio": 950.0,
        "tipoIva": "nacional"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Respuesta exitosa. Revisar en frontend.")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error en solicitud de prueba: {e}")
        print(f"Error de conexión: {e}")
        return False

def main():
    """Función principal"""
    print("\n*** TEST DE INTEGRACIÓN FRONTEND-BACKEND PARA DETALLES TRIBUTARIOS ***\n")
    
    # Iniciar el servidor de prueba
    mock_server = start_mock_server()
    
    try:
        # Probar conexión
        print(f"Probando conexión al servidor de prueba en {API_BASE_URL}...")
        time.sleep(1)
        
        # Realizar solicitud de prueba
        test_cotizacion_request()
        
        print("\nServidor de prueba en ejecución. Puedes probar la integración desde tu aplicación frontend.")
        print(f"El servidor está escuchando en {API_BASE_URL}")
        print("\nPresiona Ctrl+C para detener el servidor.\n")
        
        # Mantener el servidor en ejecución
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nDeteniendo el servidor...")
        mock_server.shutdown()
        print("Servidor detenido. Prueba finalizada.")
    except Exception as e:
        logger.error(f"Error durante la ejecución: {e}")
        print(f"Error durante la ejecución: {e}")
        mock_server.shutdown()
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 