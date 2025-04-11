#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Punto de entrada principal para el backend de cálculos de precios
Permite ejecutar diferentes componentes del sistema
"""

import os
import sys
import logging
import argparse
from datetime import datetime

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend/run.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("price_calculator_runner")

def ensure_directories():
    """Asegura que existan los directorios necesarios"""
    directories = [
        "backend/cotizaciones",
        "backend/logs"
    ]
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            logger.info(f"Directorio creado: {directory}")

def run_price_calculator():
    """Ejecuta el script de cálculo de precios en modo interactivo"""
    logger.info("Ejecutando calculadora de precios...")
    try:
        from price_calculation import main as price_main
        price_main()
    except Exception as e:
        logger.error(f"Error ejecutando la calculadora de precios: {e}")
        return 1
    return 0

def run_api_server(port=5000, debug=True):
    """Inicia el servidor API"""
    logger.info(f"Iniciando servidor API en puerto {port}...")
    try:
        from api import app
        app.run(host='0.0.0.0', port=port, debug=debug)
    except Exception as e:
        logger.error(f"Error iniciando el servidor API: {e}")
        return 1
    return 0

def print_usage():
    """Imprime información de uso"""
    print("\n=== Backend de Cálculo de Precios para Configuraciones ===")
    print("\nUso básico:")
    print("  python run.py [comando]")
    print("\nComandos disponibles:")
    print("  calc      - Ejecuta la calculadora de precios en modo interactivo")
    print("  api       - Inicia el servidor API")
    print("  help      - Muestra esta ayuda")
    print("\nEjemplos:")
    print("  python run.py calc      # Ejecuta la calculadora de precios")
    print("  python run.py api       # Inicia el servidor API en el puerto 5000")
    print("  python run.py api 8080  # Inicia el servidor API en el puerto 8080")
    print("\nPara más información, consulta el archivo README.md")

def main():
    """Función principal - Punto de entrada"""
    # Asegurar que existan los directorios necesarios
    ensure_directories()
    
    # Parsear argumentos de línea de comandos
    parser = argparse.ArgumentParser(description="Backend de Cálculo de Precios para Configuraciones")
    parser.add_argument("command", nargs="?", default="help", help="Comando a ejecutar")
    parser.add_argument("port", nargs="?", type=int, default=5000, help="Puerto para el servidor API")
    parser.add_argument("--debug", action="store_true", help="Ejecutar en modo debug")
    
    args = parser.parse_args()
    
    # Ejecutar el comando especificado
    if args.command == "calc":
        return run_price_calculator()
    elif args.command == "api":
        return run_api_server(port=args.port, debug=args.debug)
    elif args.command == "help":
        print_usage()
        return 0
    else:
        print(f"Comando desconocido: {args.command}")
        print_usage()
        return 1

if __name__ == "__main__":
    sys.exit(main()) 