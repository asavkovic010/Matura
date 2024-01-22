from flask import Flask, render_template, request
import paho.mqtt.client as mqtt
import time

# MQTT broker details
broker_address = "192.168.178.58"
broker_port = 1883
topic = "meritve/#"
data = {'1': {'soba': 'dnevna_soba',},
        '2': {'soba': 'kuhinja',},
        '3': {'soba': 'spalnica1',},
        '4': {'soba': 'spalnica2',},
        '5': {'soba': 'spalnica3',},
        '6': {'soba': 'WC',},       
        
}


def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(topic)



# Callback when a message is received from the broker
def on_message(client, userdata, msg):
    message = msg.payload.decode()
    #dobijo sam podatak merjenje/3/temp, "32"
    print(f"Received message on topic '{msg.topic}': {message}")
    tema = msg.topic
    podatki = tema.split("/")
    module_id = podatki[1]
    vrsta = podatki[2]
    novi_podatak = int(message)

    module_data = data.get(module_id)
    if module_data is None:
        module_data = {}

    stari_podatki = module_data.get(vrsta)
    if stari_podatki is None:
        stari_podatki = []
    stari_podatki.append(novi_podatak)

    module_data[vrsta] = stari_podatki
    data[module_id] = module_data
    print(data)


def create_mqtt_client():
    # Create a MQTT client
    mqtt_client = mqtt.Client()

    # Set callback functions
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    # Connect to the broker
    mqtt_client.connect(broker_address, broker_port, 60)

    # Start the MQTT client in a background thread
    print('connected to mqtt server')
    mqtt_client.loop_start()



app = Flask(__name__)


@app.route('/')
def home():
    temp = data.get('3', {}).get('temp')

    if temp == None:
        pass

    else:
        temp = temp[-1]
    return render_template('home.html', temperatura=temp)

@app.route('/temperature/')
def temp():
    return render_template('Temperature_Graphs.html')

@app.route('/humidity/')
def hum():
    return render_template('Humidity_Graphs.html')

@app.route('/pressure/')
def press():
    return render_template('Pressure_Graphs.html')

@app.route('/soba')
def soba():
    room = request.args.get('room', default="???", type=str)
    return render_template('soba.html', soba=room)

@app.get('/get_roomname')
def get_roomname():
    roomid = request.args.get('room', default="???", type=str)
    imesobe = data.get(roomid, {}).get('soba')

    return {'room_id': roomid, 'soba': imesobe}


@app.get('/last_mesurments')
def get_dnevna_soba():
    roomid = request.args.get('room', default="???", type=str)
    mtemp = data.get(roomid, {}).get('temp')
    mhum = data.get(roomid, {}).get('hum')
    mpress = data.get(roomid, {}).get('press')

    if mtemp == None and mhum == None and mpress == None:
        pass

    else:
        mhum = mhum[-1]
        mpress = mpress[-1]
        mtemp = mtemp[-1]

    dlast_mesurments = {}
    dlast_mesurments["temp"] = mtemp
    dlast_mesurments["hum"] = mhum
    dlast_mesurments["press"] = mpress
    return dlast_mesurments


#ovo ispod jos ne radi
@app.get('/get_temperature')
def get_temp():
    dtemp = {}
    tkeys = list(data.keys())
    for x in tkeys:
        gtemp = data.get(x, {}).get('temp')
        gtsoba = data.get(x, {}).get('soba')
    if gtemp == None:
        pass

    else:
        dtemp[gtsoba] = gtemp
    
    return dtemp

@app.get('/get_humidity')
def get_humidity():
    dhum = {}
    tkeys = list(data.keys())
    for x in tkeys:
        ghum = data.get(x, {}).get('hum')
        ghsoba = data.get(x, {}).get('soba')
    if ghum == None:
        pass

    else:
        dhum[ghsoba] = ghum
    
    return dhum

@app.get('/get_pressure')
def get_pressure():
    dpress = {}
    tkeys = list(data.keys())
    for x in tkeys:
        gpress = data.get(x, {}).get('press')
        gpsoba = data.get(x, {}).get('soba')
    if gpress == None:
        pass

    else:
        dpress[gpsoba] = gpress
    
    return dpress




if __name__ == "__main__":
    print('start')
    create_mqtt_client()
    app.run(host='0.0.0.0', port=5000, debug=True)
    print('end')