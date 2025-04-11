#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
API REST para el sistema de cálculo de precios
Se integra con el frontend existente a través de endpoints HTTP
"""

import os
import sys
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from price_calculation import (
    calculate_new_price, 
    apply_exchange_rate,
    calculate_shipping_cost,
    generate_cotizacion_completa,
    process_cotizacion_request
)

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend/api.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("price_calculator_api")

# Configuración de la aplicación Flask
app = Flask(__name__)
CORS(app)  # Permitir CORS para todas las rutas

# Constantes y configuraciones
PORT = int(os.environ.get('PORT', 5000))

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que la API está funcionando"""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/calculate', methods=['POST'])
def calculate_price():
    """Endpoint para calcular el precio con markup y descuento"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        base_price = float(data.get('base_price', 0))
        markup = float(data.get('markup', 20.0))
        discount = float(data.get('discount', 5.0))
        
        new_price = calculate_new_price(base_price, markup, discount)
        
        return jsonify({
            "base_price": base_price,
            "markup_percentage": markup,
            "discount_percentage": discount,
            "final_price": new_price
        })
    except Exception as e:
        logger.error(f"Error en /api/calculate: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/exchange', methods=['POST'])
def convert_currency():
    """Endpoint para convertir precios según tasa de cambio"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        price_eur = float(data.get('price_eur', 0))
        exchange_rate = float(data.get('exchange_rate', 950.0))
        
        local_price = apply_exchange_rate(price_eur, exchange_rate)
        
        return jsonify({
            "price_eur": price_eur,
            "exchange_rate": exchange_rate,
            "local_price": local_price
        })
    except Exception as e:
        logger.error(f"Error en /api/exchange: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/shipping', methods=['POST'])
def calculate_shipping():
    """Endpoint para calcular costos de envío"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        producto_principal = data.get('producto_principal', {})
        opcionales = data.get('opcionales', [])
        puerto_origen = data.get('puerto_origen', 'valencia')
        puerto_destino = data.get('puerto_destino', 'valparaiso')
        
        costs = calculate_shipping_cost(
            producto_principal, opcionales, puerto_origen, puerto_destino
        )
        
        return jsonify(costs)
    except Exception as e:
        logger.error(f"Error en /api/shipping: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cotizacion', methods=['POST'])
def generate_cotizacion():
    """Endpoint principal para generar una cotización completa"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Procesar la solicitud utilizando nuestra función de cálculo
        result = process_cotizacion_request(data)
        
        # Guardar la cotización en un archivo como respaldo (en una implementación real iría a una BD)
        cotizacion_id = result.get('cotizacion', {}).get('id_cotizacion', f"unknown-{datetime.now().strftime('%Y%m%d%H%M%S')}")
        with open(f"backend/cotizaciones/{cotizacion_id}.json", 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error en /api/cotizacion: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/webhook-proxy/<webhook_type>', methods=['GET', 'POST'])
def webhook_proxy(webhook_type):
    """
    Proxy para los webhooks existentes
    Permite procesar y modificar los datos antes de usarlos
    """
    import requests
    
    # Mapeo de tipos de webhooks a URLs
    webhook_urls = {
        "principal": "https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f",
        "opcionales": "https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254",
        "ver_detalle": "https://n8n-807184488368.southamerica-west1.run.app/webhook/c02247e7-84f0-49b3-a2df-28817da48017",
        "cotizacion": "https://n8n-807184488368.southamerica-west1.run.app/webhook/d9f32e08-c5d2-4a77-b3de-ba817e8fca3e",
        "calculo_envio": "https://n8n-807184488368.southamerica-west1.run.app/webhook/ceec46e2-1fa3-4f9b-94bb-a974bc439bf6"
    }
    
    try:
        if webhook_type not in webhook_urls:
            return jsonify({"error": f"Invalid webhook type: {webhook_type}"}), 400
            
        target_url = webhook_urls[webhook_type]
        
        # Formar URL con parámetros si es una petición GET
        if request.method == 'GET':
            # Reenviar la petición al webhook original con los mismos parámetros
            params = request.args.to_dict()
            response = requests.get(target_url, params=params)
        else:
            # Si es POST, reenviar el cuerpo de la petición
            data = request.get_json(silent=True) or {}
            response = requests.post(target_url, json=data)
        
        # Procesar y enriquecer la respuesta según sea necesario
        if webhook_type == "cotizacion":
            # Si es una respuesta de cotización, podemos enriquecerla con nuestros cálculos
            try:
                webhook_data = response.json()
                # Aquí podríamos agregar lógica para enriquecer los datos
                return jsonify(webhook_data)
            except:
                # Si hay error al parsear JSON, simplemente devolver la respuesta original
                return response.content, response.status_code, response.headers.items()
        
        # Para otros tipos de webhooks, simplemente devolver la respuesta original
        return response.content, response.status_code, response.headers.items()
    except Exception as e:
        logger.error(f"Error en el proxy de webhook {webhook_type}: {e}")
        return jsonify({
            "status": "error",
            "message": f"Error al procesar webhook: {str(e)}"
        }), 500

def create_dir_if_not_exists(directory):
    """Crea un directorio si no existe"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def main():
    """Función principal para iniciar la API"""
    # Crear directorios necesarios
    create_dir_if_not_exists("backend/cotizaciones")
    
    # Iniciar la aplicación
    app.run(host='0.0.0.0', port=PORT, debug=True)
    return 0

if __name__ == "__main__":
    sys.exit(main()) 