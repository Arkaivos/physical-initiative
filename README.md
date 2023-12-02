# Physical Initiative Foundry VTT Plugin

This Foundry VTT plugin, Physical Initiative, allows you to control lights connected to an Arduino using a Python server. The lights can be integrated into your tabletop gaming experience to provide a visual representation of initiative order.

## Installation

1. Clone or download this repository into the `modules` directory of your Foundry VTT installation.

   git clone https://github.com/arkaivos/foundry-physical-initiative.git

2. Restart your Foundry VTT server.

3. Enable the "Physical Initiative" module in the Foundry VTT setup.

## Setup

1. Connect your Arduino to your computer.

2. Modify the Python server script (physical-initiative.py) to match your Arduino's serial port. Update the `SERIAL_PORT` constant with the correct port.

3. Start the Python server by running the following command in the terminal:

   python3 physical-initiative.py

4. Configure the plugin in Foundry VTT by providing the IP address and port of the Python server.

5. Connect the Python server to the Arduino via the serial port.

6. You're ready to use Physical Initiative in your game!

## Usage

1. As a Game Master (GM), control the initiative order in Foundry VTT.

2. When a player's turn comes up, the corresponding light on the Arduino will illuminate with the color selected by that player in Foundry VTT.

3. Lights will automatically turn off when the next turn begins.

## Customization

- Customize the Arduino code (physical-initiative.ino) to adjust the behavior or add additional features to your lights.

- Modify the Python server script (physical-initiative.py) to handle specific events or integrate with other systems.

## Configuration

- Set the Python server's IP address and port in the Foundry VTT module settings.

## Notes

- Ensure that your Arduino is properly connected and recognized by your computer.

- Adjust the plugin settings in Foundry VTT to match your Python server's IP address and port.

- This plugin assumes a basic understanding of Arduino programming and Python.