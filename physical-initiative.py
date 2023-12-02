from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import serial
import time
import re

# Selecciona el nombre del puerto de serie en tu sistema.
SERIAL_PORT = 'COM3'

# Función para convertir un color HTML a componentes RGB.
def html_a_rgb(html_color):
    # Extrae los componentes RR, GG, BB de la cadena HTML.
    match = re.match(r'^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$', html_color)
    if match:
        r, g, b = [int(match.group(i), 16) for i in range(1, 4)]
        return r, g, b
    else:
        # Devuelve un color blanco por defecto si el formato no es válido.
        return 255, 255, 255

# Función para enviar datos al Arduino con color en formato HTML.
def enviar_datos(index, html_color):
    # Convierte el color HTML a componentes RGB.
    r, g, b = html_a_rgb(html_color)

    # Construye la cadena de datos y la envía al Arduino con formato "index,r,g,b".
    mensaje = f"{index},{r},{g},{b}\n"
    ser.write(mensaje.encode('utf-8'))

class MyRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Anula la función log_message para evitar que imprima mensajes de registro.
        pass    
    def do_GET(self):
        # Parsea la URL para obtener los parámetros.
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        # Extrae los valores de los parámetros.
        index = query_params.get('index', [''])[0]
        color = '#'+query_params.get('color', [''])[0]

        # Configura los encabezados CORS.
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')  # Permite cualquier origen, cambiar si fuese necesario.
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.end_headers()

        if (int(index) > 0):
            print("Turning on initiative light for player "+index+" in color "+color)
            enviar_datos(int(index)-1, color)
        else:
            print("Turning off all initiative lights.")
            enviar_datos(-1, color)

        # Construye el cuerpo de la respuesta
        response_content = '{"status": "ok"}'
        self.wfile.write(response_content.encode('utf-8'))

def run_server(port=5500):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyRequestHandler)

    print(f"Physical Initiative Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    try:
        ser = serial.Serial(SERIAL_PORT, 9600, timeout=1)
    except serial.SerialException as e:
        print(f"No Arduino detected at {PUERTO_SERIE} port.")
        quit()
    run_server()
