from flask import Flask, render_template
from flask_socketio import SocketIO
import paho.mqtt.client as mqtt

app = Flask(__name__)
socketio = SocketIO(app)

# MQTT broker details
broker_address = "192.168.178.58"
broker_port = 1883
topic = "temp"
topic1 = "hum"
topic2 = "press"  # Change this to your desired MQTT topic

# Callback when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    # Subscribe to the topic when connected
    client.subscribe(topic)

# Callback when a message is received from the broker
def on_message(client, userdata, msg):
    message = msg.payload.decode()
    print(f"Received message on topic '{msg.topic}': {message}")
    # Emit the message to the client using SocketIO
    socketio.emit('mqtt_message', {'message': message})

# Create a MQTT client
mqtt_client = mqtt.Client()

# Set callback functions
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Connect to the broker
mqtt_client.connect(broker_address, broker_port, 60)

# Start the MQTT client in a background thread
mqtt_client.loop_start()

# Flask route to render the template
@app.route('/')
def index():
    return render_template('index.html')

# SocketIO event handler for connection
@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == '__main__':
    socketio.run(app, debug=True)


app.run(host='0.0.0.0', port=5000)
