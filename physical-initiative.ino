#include <Adafruit_NeoPixel.h>

#define PIN            5   // Pin de datos conectado a la tira de LED.
#define NUMPIXELS      4   // Número de LEDs.

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);  // Inicializa la comunicación serie a 9600 bps.

  strip.begin();       // Inicializa la tira de LED.
  strip.show();        // Actualiza la tira de LED con los colores actuales.
}

void loop() {
  if (Serial.available() > 2) {
    // Lee el índice y el color desde el puerto serie en formato "index,r,g,b".
    int index = Serial.parseInt();
    char comma = Serial.read();
    uint8_t r = Serial.parseInt();
    comma = Serial.read();
    uint8_t g = Serial.parseInt();
    comma = Serial.read();
    uint8_t b = Serial.parseInt();
    comma = Serial.read();

    // Debug: Muestra los datos recibidos en el puerto serie.
    //Serial.print("Index: ");
    //Serial.print(index);
    //Serial.print(", Color (R, G, B): ");
    //Serial.print(r);
    //Serial.print(", ");
    //Serial.print(g);
    //Serial.print(", ");
    //Serial.println(b);

    // Verifica si el índice es -1 (apagar todos los LEDs).
    if (index == -1) {
      // Apaga todos los LEDs.
      strip.fill(0);  // Apaga todos los leds.
      strip.show();  // Actualiza la tira de LED con los colores actuales.
    } else if (index >= 0 && index < NUMPIXELS) {
      strip.fill(0);  // Apaga todos los leds.
      strip.setPixelColor(index, r, g, b); // Enciende el LED en la posición especificada con el color especificado.
      strip.show();  // Actualiza la tira de LED con los colores actuales.
    } else {
      Serial.println("Index out of range.");
    }
  }
}
