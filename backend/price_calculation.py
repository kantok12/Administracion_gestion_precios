#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Módulo de cálculo de precios para configuraciones (antiguo sistema de cotización)
Integrado con los webhooks existentes del sistema
"""

import json
import os
import sys
import logging
from datetime import datetime
from typing import Dict, List, Union, Optional, Any

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend/price_calculation.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("price_calculator")

# URLs de webhooks (mismas que en la aplicación principal)
WEBHOOK_URLS = {
    "principal": "https://n8n-807184488368.southamerica-west1.run.app/webhook/6f697684-4cfc-4bc1-8918-bfffc9f20b9f",
    "opcionales": "https://n8n-807184488368.southamerica-west1.run.app/webhook/ac8b70a7-6be5-4e1a-87b3-3813464dd254",
    "ver_detalle": "https://n8n-807184488368.southamerica-west1.run.app/webhook/c02247e7-84f0-49b3-a2df-28817da48017",
    "cotizacion": "https://n8n-807184488368.southamerica-west1.run.app/webhook/d9f32e08-c5d2-4a77-b3de-ba817e8fca3e",
    "calculo_envio": "https://n8n-807184488368.southamerica-west1.run.app/webhook/ceec46e2-1fa3-4f9b-94bb-a974bc439bf6"
}

# Valores por defecto (estos se podrían cargar desde un archivo de configuración)
DEFAULT_MARKUP_PERCENTAGE = 20.0
DEFAULT_DISCOUNT_PERCENTAGE = 5.0

def calculate_new_price(base_price: float, markup_percentage: float = DEFAULT_MARKUP_PERCENTAGE, 
                       discount_percentage: float = DEFAULT_DISCOUNT_PERCENTAGE) -> float:
    """
    Calcula el nuevo precio basado en:
    - Precio base
    - Porcentaje de margen (markup)
    - Porcentaje de descuento
    
    Args:
        base_price: Precio base del producto
        markup_percentage: Porcentaje de margen (por defecto 20%)
        discount_percentage: Porcentaje de descuento (por defecto 5%)
        
    Returns:
        float: Precio final calculado
    """
    try:
        # Validar entradas
        if base_price < 0:
            logger.error(f"Precio base no puede ser negativo: {base_price}")
            return 0.0
            
        # Aplicar markup
        price_with_markup = base_price * (1 + markup_percentage / 100)
        
        # Aplicar descuento
        final_price = price_with_markup * (1 - discount_percentage / 100)
        
        # Redondear a 2 decimales
        return round(final_price, 2)
    except Exception as e:
        logger.error(f"Error en el cálculo de precios: {e}")
        return 0.0

def apply_exchange_rate(price_eur: float, exchange_rate: float) -> float:
    """
    Convierte un precio en EUR a la moneda local usando la tasa de cambio
    
    Args:
        price_eur: Precio en euros
        exchange_rate: Tasa de cambio (por ejemplo, 950 CLP por 1 EUR)
        
    Returns:
        float: Precio en moneda local
    """
    try:
        return round(price_eur * exchange_rate, 2)
    except Exception as e:
        logger.error(f"Error en la conversión de moneda: {e}")
        return 0.0

def calculate_shipping_cost(producto_principal: Dict[str, Any], 
                           opcionales: List[Dict[str, Any]],
                           puerto_origen: str,
                           puerto_destino: str) -> Dict[str, float]:
    """
    Calcula los costos de envío basado en el producto principal, opcionales y puertos
    
    Args:
        producto_principal: Datos del producto principal
        opcionales: Lista de productos opcionales
        puerto_origen: Puerto de origen
        puerto_destino: Puerto de destino
        
    Returns:
        Dict: Diccionario con los costos de envío desglosados
    """
    try:
        # Calcular el peso total (esto es un ejemplo, la lógica real dependería de los datos)
        peso_principal = float(producto_principal.get("peso_kg", 0))
        peso_opcionales = sum(float(opt.get("peso_kg", 0)) for opt in opcionales)
        peso_total = peso_principal + peso_opcionales
        
        # Calcular volumen total
        volumen_principal = float(producto_principal.get("volumen_m3", 0))
        volumen_opcionales = sum(float(opt.get("volumen_m3", 0)) for opt in opcionales)
        volumen_total = volumen_principal + volumen_opcionales
        
        # Costo base según puerto origen-destino (simplificado, esto debería venir de una tabla)
        costos_rutas = {
            "valencia-valparaiso": 2500,
            "valencia-sanantonio": 2400,
            "barcelona-valparaiso": 2600,
            "barcelona-sanantonio": 2500,
            "default": 3000
        }
        
        ruta = f"{puerto_origen.lower()}-{puerto_destino.lower()}"
        costo_base = costos_rutas.get(ruta, costos_rutas["default"])
        
        # Ajuste por peso y volumen
        costo_por_peso = peso_total * 5  # 5 EUR por kg
        costo_por_volumen = volumen_total * 100  # 100 EUR por m3
        
        # El costo final es el máximo entre costo por peso y costo por volumen
        costo_variable = max(costo_por_peso, costo_por_volumen)
        
        # Costo total
        costo_total = costo_base + costo_variable
        
        # Seguro (ejemplo: 1% del valor de los productos)
        valor_productos = float(producto_principal.get("pf_eur", 0)) + \
                         sum(float(opt.get("pf_eur", 0)) for opt in opcionales)
        seguro = valor_productos * 0.01
        
        # Impuestos y aranceles (simplificado)
        impuestos = costo_total * 0.19  # 19% IVA
        
        return {
            "costo_base": round(costo_base, 2),
            "costo_variable": round(costo_variable, 2),
            "seguro": round(seguro, 2),
            "impuestos": round(impuestos, 2),
            "costo_total": round(costo_total + seguro + impuestos, 2)
        }
    except Exception as e:
        logger.error(f"Error en el cálculo de costos de envío: {e}")
        return {
            "costo_base": 0,
            "costo_variable": 0,
            "seguro": 0,
            "impuestos": 0,
            "costo_total": 0,
            "error": str(e)
        }

def generate_cotizacion_completa(producto_principal: Dict[str, Any], 
                                opcionales: List[Dict[str, Any]],
                                markup_percentage: float = DEFAULT_MARKUP_PERCENTAGE,
                                discount_percentage: float = DEFAULT_DISCOUNT_PERCENTAGE,
                                exchange_rate: float = 950.0,
                                puerto_origen: str = "valencia",
                                puerto_destino: str = "valparaiso") -> Dict[str, Any]:
    """
    Genera una cotización completa con todos los cálculos
    
    Args:
        producto_principal: Datos del producto principal
        opcionales: Lista de productos opcionales
        markup_percentage: Porcentaje de margen
        discount_percentage: Porcentaje de descuento
        exchange_rate: Tasa de cambio EUR a moneda local
        puerto_origen: Puerto de origen
        puerto_destino: Puerto de destino
        
    Returns:
        Dict: Cotización completa con todos los detalles
    """
    try:
        # Preparar los datos del producto principal
        precio_base_eur = float(producto_principal.get("pf_eur", 0))
        precio_final_eur = calculate_new_price(precio_base_eur, markup_percentage, discount_percentage)
        precio_final_local = apply_exchange_rate(precio_final_eur, exchange_rate)
        
        producto_procesado = {
            "codigo": producto_principal.get("codigo_producto", ""),
            "nombre": producto_principal.get("nombre_del_producto", ""),
            "precio_base_eur": precio_base_eur,
            "precio_final_eur": precio_final_eur,
            "precio_final_local": precio_final_local
        }
        
        # Procesar opcionales
        opcionales_procesados = []
        for opcional in opcionales:
            precio_opcional_eur = float(opcional.get("pf_eur", 0))
            precio_opcional_final_eur = calculate_new_price(precio_opcional_eur, markup_percentage, discount_percentage)
            precio_opcional_final_local = apply_exchange_rate(precio_opcional_final_eur, exchange_rate)
            
            opcionales_procesados.append({
                "codigo": opcional.get("codigo_producto", ""),
                "nombre": opcional.get("nombre_del_producto", ""),
                "precio_base_eur": precio_opcional_eur,
                "precio_final_eur": precio_opcional_final_eur,
                "precio_final_local": precio_opcional_final_local
            })
        
        # Calcular totales
        total_base_eur = precio_base_eur + sum(float(opt.get("pf_eur", 0)) for opt in opcionales)
        total_final_eur = precio_final_eur + sum(opt["precio_final_eur"] for opt in opcionales_procesados)
        total_final_local = precio_final_local + sum(opt["precio_final_local"] for opt in opcionales_procesados)
        
        # Calcular costos de envío
        costos_envio = calculate_shipping_cost(
            producto_principal, opcionales, puerto_origen, puerto_destino
        )
        
        # Generar cotización completa
        cotizacion = {
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "id_cotizacion": f"COT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "producto_principal": producto_procesado,
            "opcionales": opcionales_procesados,
            "totales": {
                "subtotal_eur": round(total_base_eur, 2),
                "total_con_markup_eur": round(total_base_eur * (1 + markup_percentage / 100), 2),
                "descuento_aplicado_eur": round(total_base_eur * (markup_percentage / 100) * (discount_percentage / 100), 2),
                "total_final_eur": round(total_final_eur, 2),
                "total_final_local": round(total_final_local, 2),
                "tasa_cambio_aplicada": exchange_rate
            },
            "envio": costos_envio,
            "parametros": {
                "markup_porcentaje": markup_percentage,
                "descuento_porcentaje": discount_percentage,
                "puerto_origen": puerto_origen,
                "puerto_destino": puerto_destino
            },
            "gran_total_eur": round(total_final_eur + costos_envio["costo_total"], 2),
            "gran_total_local": round(total_final_local + apply_exchange_rate(costos_envio["costo_total"], exchange_rate), 2)
        }
        
        return cotizacion
    except Exception as e:
        logger.error(f"Error generando cotización completa: {e}")
        return {
            "error": str(e),
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "error"
        }

# Función para simular un endpoint API que podría integrarse con un framework como Flask
def process_cotizacion_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Procesa una solicitud de cotización (simula un endpoint API)
    
    Args:
        data: Datos de la solicitud
        
    Returns:
        Dict: Respuesta de la cotización
    """
    try:
        # Extraer datos
        producto_principal = data.get("productoPrincipal", {})
        opcionales = data.get("opcionalesSeleccionados", [])
        markup = data.get("markup", DEFAULT_MARKUP_PERCENTAGE)
        descuento = data.get("descuento", DEFAULT_DISCOUNT_PERCENTAGE)
        exchange_rate = data.get("tasaCambio", 950.0)
        puerto_origen = data.get("puertoOrigen", "valencia")
        puerto_destino = data.get("puertoDestino", "valparaiso")
        
        # Generar cotización
        cotizacion = generate_cotizacion_completa(
            producto_principal, opcionales, markup, descuento, 
            exchange_rate, puerto_origen, puerto_destino
        )
        
        # Registrar la cotización (en un caso real, esto iría a una base de datos)
        logger.info(f"Cotización generada: {cotizacion['id_cotizacion']}")
        
        return {
            "status": "success",
            "cotizacion": cotizacion
        }
    except Exception as e:
        logger.error(f"Error procesando solicitud de cotización: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# Función para ejecutar cálculos directamente (uso de línea de comandos)
def main():
    """Función principal para pruebas directas desde línea de comandos"""
    # Ejemplo básico
    base_price = 100
    markup = 20
    discount = 5
    new_price = calculate_new_price(base_price, markup, discount)
    
    print(f"\n--- CÁLCULO BÁSICO DE PRECIOS ---")
    print(f"Precio base: €{base_price}")
    print(f"Margen aplicado: {markup}%")
    print(f"Descuento aplicado: {discount}%")
    print(f"Precio final: €{new_price}")
    
    # Ejemplo más complejo con una cotización completa
    producto_principal = {
        "codigo_producto": "A141XL",
        "nombre_del_producto": "Chipeadora PTO A141XL - 3 Puntos de enlace - Cat.II - Abertura 410 x 300mm",
        "Descripcion": "Chipeadora profesional con sistema de corte por disco",
        "Modelo": "A141XL",
        "pf_eur": "22500",
        "transporte_nacional": "1200",
        "peso_kg": "850",
        "volumen_m3": "4.5"
    }
    
    opcionales = [
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
    ]
    
    cotizacion = generate_cotizacion_completa(
        producto_principal, opcionales, 
        markup_percentage=18.5, 
        discount_percentage=3.0,
        exchange_rate=950.0,
        puerto_origen="valencia",
        puerto_destino="valparaiso"
    )
    
    print(f"\n--- EJEMPLO DE COTIZACIÓN COMPLETA ---")
    print(json.dumps(cotizacion, indent=2, ensure_ascii=False))
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 