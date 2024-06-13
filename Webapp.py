from flask import Flask, render_template, request
import paho.mqtt.client as mqtt
import time

MAX_MEAS_NO = 30

# MQTT broker details
broker_address = "192.168.178.58"
broker_port = 1883
topic = "meritve/#"

data = {}

imena = {
    '1': "Dnevna soba",
    '2': "Kuhinja",
    '3': "Spalnica1",
    '4': "Spalnica2",
    '5': "Spalnica3",
    '6': "Kopalnica",
}

heartbeats = {}


def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(topic)



# Callback when a message is received from the broker
def on_message(client, userdata, msg):
    message = msg.payload.decode()
    tema = msg.topic
    podatki = tema.split("/")
    module_id = podatki[1]
    vrsta = podatki[2]
    novi_podatak = float(message)
    if vrsta == "heartbeat":
        heartbeats[module_id] = int(time.time())

    else:
        module_data = data.get(module_id)
        if module_data is None:
            module_data = {}

        stari_podatki = module_data.get(vrsta)
        if stari_podatki is None:
            stari_podatki = []
        
        current_time = time.localtime()
        formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', current_time)
        stari_podatki.append({"val": novi_podatak, "time": formatted_time})
        if len(stari_podatki) > MAX_MEAS_NO:
            stari_podatki.pop(0)

        module_data[vrsta] = stari_podatki
        data[module_id] = module_data


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

def isalive(moduleid):
    return int(time.time()) - heartbeats.get(moduleid, 0) < 10

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/soba')
def soba():
    roomid = request.args.get('room', default="???", type=str)
    roomname = imena.get(roomid, {})
    return render_template('soba.html', soba=roomname)

@app.route('/meritve')
def meritve():
    vrsta = request.args.get('vrsta', default="???", type=str)
    return render_template('meritve.html', naslov=vrsta)

# @app.route('/settings')
# def settings():
#     return render_template('settings.html')

#RESTAPI-------------------------------------------
@app.get('/get_all_mesurments')
def get_all_mesurments():
    dmes = {}
    roomids = list(data.keys())
    for roomid in roomids:
        gatemp = data.get(roomid, {}).get('temp')
        gahum = data.get(roomid, {}).get('hum')
        gapress = data.get(roomid, {}).get('press')
        if gatemp == None and gahum == None and gapress == None:
            pass

        else:
            dmes[roomid] = {'temp': gatemp, 'hum': gahum, 'press': gapress}
        
    return dmes

@app.get('/get_temperature')
def get_temp():
    dtemp = {}
    tkeys = list(data.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        gtemp = data.get(x, {}).get('temp')
        if gtemp == None:
            pass

        else:
            dtemp[x] = {"graphd": gtemp, "ime": ime} 
        
    return dtemp

@app.get('/get_humidity')
def get_humidity():
    dhum = {}
    tkeys = list(data.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        ghum = data.get(x, {}).get('hum')
        if ghum == None:
            pass

        else:
            dhum[x] = {"graphd": ghum, "ime": ime} 
    
    return dhum

@app.get('/get_pressure')
def get_pressure():
    dpress = {}
    tkeys = list(data.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        gpress = data.get(x, {}).get('press')
        if gpress == None:
            pass

        else:
            dpress[x] = {"graphd": gpress, "ime": ime} 
    
    return dpress

@app.get('/get_room_meas')
def get_room_meas():
    roomid = request.args.get('room', default="???", type=str)
    rtemp = data.get(roomid, {}).get('temp')
    rhum = data.get(roomid, {}).get('hum')
    rpress = data.get(roomid, {}).get('press')
        
    return {'temp': rtemp, 'hum': rhum, 'press': rpress}

@app.get('/get_all_room_names')
def get_all_room_names():
    return imena

@app.get('/get_roomname')
def get_roomname():
    roomid = request.args.get('room', default="???", type=str)
    imesobe = imena.get(roomid, {})

    return {'room_id': roomid, 'soba': imesobe}

@app.get('/all_last_mesurments')
def get_all_last_mesurments():
    amhum = 0
    ampress = 0
    amtemp = 0
    dall_last_mesurments = {}
    keys = list(data.keys())

    for i in keys:
        listtemp = data.get(i, {}).get('temp')
        if  listtemp != None:
            for item in listtemp:
                amtemp = item.get("val", {})
        else:
            pass
        listhum = data.get(i, {}).get('hum')
        if  listhum != None:
            for item in listhum:
                amhum = item.get("val", {})
        else:
            pass
        listpress = data.get(i, {}).get('press')
        if  listpress != None:
            for item in listpress:
                ampress = item.get("val", {})
        else:
            pass
        if amtemp == None and amhum == None and ampress == None:
            pass

        status = "online" if isalive(i) else "offline"
        dall_last_mesurments[i] = {'temp': amtemp, 'hum': amhum, 'press': ampress, "status": status}
    return dall_last_mesurments

@app.get('/all')
def get_all():
    return data

@app.get('/isalive')
def alive():
    moduleid = request.args.get('room', default="???", type=str)  
    return str(isalive(moduleid))


#---------------------------------------------------
if __name__ == "__main__":
    print('start')
    create_mqtt_client()
    app.run(host='0.0.0.0', port=5000, debug=True)
    print('end')

