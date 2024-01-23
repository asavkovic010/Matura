from flask import Flask, render_template, request
import paho.mqtt.client as mqtt
import time

# MQTT broker details
broker_address = "192.168.178.58"
broker_port = 1883
topic = "meritve/#"
data = {'1': {'soba': 'dnevna soba', 'temp': [12, 23, 13], 'hum': [12, 23, 33], 'press': [12, 23, 33]},
        '2': {'soba': 'kuhinja', 'temp': [22, 23, 23], 'hum': [12, 23, 33], 'press': [12, 23, 33]},
        '3': {'soba': 'spalnica1', 'temp': [32, 23, 33], 'hum': [12, 23, 33], 'press': [12, 23, 33]},
        '4': {'soba': 'spalnica2', 'temp': [42, 23, 43], 'hum': [12, 23, 33], 'press': [12, 23, 33]},
        '5': {'soba': 'spalnica3', 'temp': [52, 23, 53], 'hum': [12, 23, 33], 'press': [12, 23, 33]},
        '6': {'soba': 'WC', 'temp': [62, 23, 63], 'hum': [12, 23, 33], 'press': [12, 23, 33]},       
        
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
    roomid = request.args.get('room', default="???", type=str)
    roomname = data.get(roomid, {}).get('soba')
    return render_template('soba.html', soba=roomname)

@app.get('/get_roomname')
def get_roomname():
    roomid = request.args.get('room', default="???", type=str)
    imesobe = data.get(roomid, {}).get('soba')

    return {'room_id': roomid, 'soba': imesobe}


@app.get('/last_mesurments')
def get_last_mesurmnts():
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

@app.get('/all_last_mesurments')
def get_all_last_mesurments():
    dall_last_mesurments = {}
    keys = list(data.keys())

    for i in keys:
        amtemp = data.get(i, {}).get('temp')
        amhum = data.get(i, {}).get('hum')
        ampress = data.get(i, {}).get('press')
        if amtemp == None and amhum == None and ampress == None:
            pass

        else:
            amhum = amhum[-1]
            ampress = ampress[-1]
            amtemp = amtemp[-1]
        dall_last_mesurments[i] = {'temp': amtemp, 'hum': amhum, 'press': ampress}

    # if mtemp == None and mhum == None and mpress == None:
    #     pass

    # else:
    #     mhum = mhum[-1]
    #     mpress = mpress[-1]
    #     mtemp = mtemp[-1]

    # dlast_mesurments = {}
    # dlast_mesurments["temp"] = mtemp
    # dlast_mesurments["hum"] = mhum
    # dlast_mesurments["press"] = mpress
    return dall_last_mesurments

@app.get('/get_all_room_names')
def get_all_room_names():
    dall_room_names = {}
    keys = list(data.keys())

    for i in keys:
        imesobe = data.get(i, {}).get('soba')
        dall_room_names[i] = imesobe
    return dall_room_names


#ovo ispod jos ne radi -------------------------------------------------------------
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
#-----------------------------------------------------------------------------------------



if __name__ == "__main__":
    print('start')
    create_mqtt_client()
    app.run(host='0.0.0.0', port=5000, debug=True)
    print('end')