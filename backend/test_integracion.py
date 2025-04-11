#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de prueba para la integración del backend con el frontend
Simula las llamadas que haría el frontend al backend
"""

import sys
import json
import logging
from datetime import datetime
import requests

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend/logs/test_integracion.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("test_integracion")

# URL base para pruebas
API_BASE_URL = "http://localhost:5000"

def print_section(title):
    """Imprime un separador de sección para mejorar la legibilidad"""
    print("\n" + "=" * 50)
    print(f" {title} ".center(50, "="))
    print("=" * 50 + "\n")

def test_health_check():
    """Prueba el endpoint de health check"""
    print_section("HEALTH CHECK")
    url = f"{API_BASE_URL}/health"
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return True
    except Exception as e:
        logger.error(f"Error en health check: {e}")
        print(f"Error: {e}")
        return False

def test_calculate_price():
    """Prueba el cálculo básico de precios"""
    print_section("CÁLCULO DE PRECIOS")
    url = f"{API_BASE_URL}/api/calculate"
    
    data = {
        "base_price": 100,
        "markup": 20,
        "discount": 5
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Request: {json.dumps(data, indent=2)}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        logger.error(f"Error en cálculo de precios: {e}")
        print(f"Error: {e}")
        return False

def test_exchange_rate():
    """Prueba la conversión de moneda"""
    print_section("CONVERSIÓN DE MONEDA")
    url = f"{API_BASE_URL}/api/exchange"
    
    data = {
        "price_eur": 100,
        "exchange_rate": 950.25
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Request: {json.dumps(data, indent=2)}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        logger.error(f"Error en conversión de moneda: {e}")
        print(f"Error: {e}")
        return False

def test_shipping_costs():
    """Prueba el cálculo de costos de envío"""
    print_section("CÁLCULO DE COSTOS DE ENVÍO")
    url = f"{API_BASE_URL}/api/shipping"
    
    data = {
        "producto_principal": {
            "codigo_producto": "A141XL",
            "nombre_del_producto": "Chipeadora PTO A141XL",
            "pf_eur": "22500",
            "peso_kg": "850",
            "volumen_m3": "4.5"
        },
        "opcionales": [
            {
                "codigo_producto": "16521",
                "nombre_del_producto": "Eje PTO con Disco Volante",
                "pf_eur": "1250",
                "peso_kg": "45",
                "volumen_m3": "0.2"
            },
            {
                "codigo_producto": "16902",
                "nombre_del_producto": "Eje PTO con Disco Volante y Embrague",
                "pf_eur": "1850",
                "peso_kg": "52",
                "volumen_m3": "0.25"
            }
        ],
        "puerto_origen": "valencia",
        "puerto_destino": "valparaiso"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Request: {json.dumps(data, indent=2)}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        logger.error(f"Error en cálculo de costos de envío: {e}")
        print(f"Error: {e}")
        return False

def test_cotizacion_completa():
    """Prueba la generación de una cotización completa"""
    print_section("GENERACIÓN DE COTIZACIÓN COMPLETA")
    url = f"{API_BASE_URL}/api/cotizacion"
    
    data = {
        "productoPrincipal": {
            "codigo_producto": "A141XL",
            "nombre_del_producto": "Chipeadora PTO A141XL - 3 Puntos de enlace - Cat.II - Abertura 410 x 300mm",
            "Descripcion": "Chipeadora profesional con sistema de corte por disco",
            "Modelo": "A141XL",
            "pf_eur": "22500",
            "transporte_nacional": "1200",
            "peso_kg": "850",
            "volumen_m3": "4.5"
        },
        "opcionalesSeleccionados": [
            {
                "codigo_producto": "16521",
                "nombre_del_producto": "Eje PTO con Disco Volante de Inercia para Chipeadora A141XL - PTO",
                "Descripcion": "Eje PTO reforzado con disco volante",
                "pf_eur": "1250",
                "peso_kg": "45",
                "volumen_m3": "0.2"
            },
            {
                "codigo_producto": "16902",
                "nombre_del_producto": "Eje PTO con Disco Volante de Inercia y Embrague para Chipeadora A141XL - PTO",
                "Descripcion": "Eje PTO premium con embrague integrado",
                "pf_eur": "1850",
                "peso_kg": "52",
                "volumen_m3": "0.25"
            }
        ],
        "markup": 18.5,
        "descuento": 3.0,
        "tasaCambio": 950.0,
        "puertoOrigen": "valencia",
        "puertoDestino": "valparaiso"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Request contenía {len(data['opcionalesSeleccionados'])} opcionales para el producto {data['productoPrincipal']['codigo_producto']}")
        
        # Mostrar solo un resumen de la respuesta (puede ser muy larga)
        respuesta = response.json()
        if 'cotizacion' in respuesta:
            cotizacion = respuesta['cotizacion']
            print("\nRESUMEN DE COTIZACIÓN:")
            print(f"ID: {cotizacion.get('id_cotizacion', 'N/A')}")
            print(f"Fecha: {cotizacion.get('fecha', 'N/A')}")
            print(f"Producto Principal: {cotizacion.get('producto_principal', {}).get('nombre', 'N/A')}")
            print(f"Cantidad de Opcionales: {len(cotizacion.get('opcionales', []))}")
            
            totales = cotizacion.get('totales', {})
            print(f"\nTotales:")
            print(f"  Subtotal EUR: {totales.get('subtotal_eur', 'N/A')}")
            print(f"  Total Final EUR: {totales.get('total_final_eur', 'N/A')}")
            print(f"  Total Final Local: {totales.get('total_final_local', 'N/A')}")
            
            envio = cotizacion.get('envio', {})
            print(f"\nEnvío:")
            print(f"  Costo Base: {envio.get('costo_base', 'N/A')}")
            print(f"  Costo Variable: {envio.get('costo_variable', 'N/A')}")
            print(f"  Costo Total Envío: {envio.get('costo_total', 'N/A')}")
            
            print(f"\nGran Total EUR: {cotizacion.get('gran_total_eur', 'N/A')}")
            print(f"Gran Total Local: {cotizacion.get('gran_total_local', 'N/A')}")
        else:
            print(json.dumps(respuesta, indent=2))
            
        return True
    except Exception as e:
        logger.error(f"Error en generación de cotización: {e}")
        print(f"Error: {e}")
        return False

def test_webhook_proxy():
    """Prueba el proxy de webhook"""
    print_section("PROXY DE WEBHOOK")
    # Probar el proxy del webhook principal
    url = f"{API_BASE_URL}/api/webhook-proxy/principal"
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        
        # Intentar parsear la respuesta como JSON
        try:
            data = response.json()
            print(f"Cantidad de productos recibidos: {len(data)}")
            print(f"Primer producto: {json.dumps(data[0], indent=2)}")
        except:
            print("La respuesta no es un JSON válido o está vacía")
            
        return True
    except Exception as e:
        logger.error(f"Error en proxy de webhook: {e}")
        print(f"Error: {e}")
        return False

def main():
    """Función principal"""
    print("\n>>> TEST DE INTEGRACIÓN DEL BACKEND DE CÁLCULO DE PRECIOS <<<\n")
    print(f"Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"URL Base de API: {API_BASE_URL}")
    
    # Ejecutar las pruebas
    tests = [
        ("Health Check", test_health_check),
        ("Cálculo de Precios", test_calculate_price),
        ("Conversión de Moneda", test_exchange_rate),
        ("Cálculo de Costos de Envío", test_shipping_costs),
        ("Generación de Cotización Completa", test_cotizacion_completa),
        ("Proxy de Webhook", test_webhook_proxy)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            print(f"\nEjecutando test: {name}...")
            success = test_func()
            results.append((name, success))
        except Exception as e:
            logger.error(f"Error en test {name}: {e}")
            print(f"Error inesperado en test {name}: {e}")
            results.append((name, False))
    
    # Mostrar resumen
    print_section("RESUMEN DE PRUEBAS")
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
    
    success_count = sum(1 for _, success in results if success)
    print(f"\nResultados: {success_count}/{len(results)} pruebas exitosas")
    
    if success_count == len(results):
        print("\n¡Todas las pruebas pasaron correctamente! ✨ El backend está listo para integrarse con el frontend.")
    else:
        print("\nAlgunas pruebas fallaron. Revisa los errores arriba e intenta solucionarlos.")
    
    return 0 if success_count == len(results) else 1

if __name__ == "__main__":
    sys.exit(main()) 