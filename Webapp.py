from flask import Flask, render_template, request
import paho.mqtt.client as mqtt
import time

MAX_MEAS_NO = 30

# MQTT broker details
broker_address = "192.168.178.58"
broker_port = 1883
topic = "meritve/#"
# data = {'1': {'soba': 'dnevna soba', 'temp': [12, 22, 23], 'hum': [33, 23, 43], 'press': [1012, 1013, 1010]},
#         '2': {'soba': 'kuhinja', 'temp': [22, 23, 23], 'hum': [12, 23, 33], 'press': [1012, 1013, 1010]},
#         '3': {'soba': 'spalnica1', 'temp': [32, 23, 33], 'hum': [12, 23, 33], 'press': [1012, 1013, 1010]},
#         '4': {'soba': 'spalnica2', 'temp': [42, 23, 43], 'hum': [12, 23, 33], 'press': [1012, 1013, 1010]},
#         '5': {'soba': 'spalnica3', 'temp': [52, 23, 53], 'hum': [12, 23, 33], 'press': [1012, 1013, 1010]},
#         '6': {'soba': 'WC', 'temp': [21, 22, 20], 'hum': [12, 23, 33], 'press': [1012, 1013, 1010]},       
        
# }

data2 = {}

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
    #dobijo sam podatak merjenje/3/temp, "32"
    # print(f"Received message on topic '{msg.topic}': {message}")
    tema = msg.topic
    podatki = tema.split("/")
    module_id = podatki[1]
    vrsta = podatki[2]
    novi_podatak = float(message)
    if vrsta == "heartbeat":
        heartbeats[module_id] = int(time.time())
        # print (heartbeats)

    else:
        # module_data = data.get(module_id)
        # if module_data is None:
        #     module_data = {}

        # stari_podatki = module_data.get(vrsta)
        # if stari_podatki is None:
        #     stari_podatki = []
        
        # stari_podatki.append(novi_podatak)
        # if len(stari_podatki) > MAX_MEAS_NO:
        #     stari_podatki.pop(0)

        # module_data[vrsta] = stari_podatki
        # data[module_id] = module_data
        # # print(data)



        module_data2 = data2.get(module_id)
        if module_data2 is None:
            module_data2 = {}

        stari_podatki2 = module_data2.get(vrsta)
        if stari_podatki2 is None:
            stari_podatki2 = []
        
        current_time = time.localtime()
        formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', current_time)
        stari_podatki2.append({"val": novi_podatak, "time": formatted_time})
        if len(stari_podatki2) > MAX_MEAS_NO:
            stari_podatki2.pop(0)

        module_data2[vrsta] = stari_podatki2
        data2[module_id] = module_data2


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
    # temp = data.get('3', {}).get('temp')

    # if temp == None:
    #     pass

    # else:
    #     temp = temp[-1]
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

@app.route('/settings')
def settings():
    # roomid = request.args.get('room', default="???", type=str)
    # roomname = data.get(roomid, {}).get('soba')
    # return render_template('soba.html', soba=roomname)
    return render_template('settings.html')


#RESTAPI---------------------------------------------
# @app.get('/get_roomname')
# def get_roomname():
#     roomid = request.args.get('room', default="???", type=str)
#     imesobe = data.get(roomid, {}).get('soba')

#     return {'room_id': roomid, 'soba': imesobe}

# @app.get('/last_mesurments')
# def get_last_mesurmnts():
#     roomid = request.args.get('room', default="???", type=str)
#     mtemp = data.get(roomid, {}).get('temp')
#     mhum = data.get(roomid, {}).get('hum')
#     mpress = data.get(roomid, {}).get('press')

#     if mtemp == None and mhum == None and mpress == None:
#         pass

#     else:
#         mhum = mhum[-1]
#         mpress = mpress[-1]
#         mtemp = mtemp[-1]

#     dlast_mesurments = {}
#     dlast_mesurments["temp"] = mtemp
#     dlast_mesurments["hum"] = mhum
#     dlast_mesurments["press"] = mpress
#     return dlast_mesurments

# @app.get('/all_last_mesurments')
# def get_all_last_mesurments():
#     dall_last_mesurments = {}
#     keys = list(data.keys())

#     for i in keys:
#         amtemp = data.get(i, {}).get('temp')
#         amhum = data.get(i, {}).get('hum')
#         ampress = data.get(i, {}).get('press')
#         if amtemp == None and amhum == None and ampress == None:
#             pass

#         else:
#             amhum = amhum[-1]
#             ampress = ampress[-1]
#             amtemp = amtemp[-1]
#         dall_last_mesurments[i] = {'temp': amtemp, 'hum': amhum, 'press': ampress}

#     # if mtemp == None and mhum == None and mpress == None:
#     #     pass

#     # else:
#     #     mhum = mhum[-1]
#     #     mpress = mpress[-1]
#     #     mtemp = mtemp[-1]

#     # dlast_mesurments = {}
#     # dlast_mesurments["temp"] = mtemp
#     # dlast_mesurments["hum"] = mhum
#     # dlast_mesurments["press"] = mpress
#     return dall_last_mesurments

# @app.get('/get_all_room_names')
# def get_all_room_names():
#     dall_room_names = {}
#     keys = list(data.keys())

#     for i in keys:
#         imesobe = data.get(i, {}).get('soba')
#         dall_room_names[i] = imesobe
#     return dall_room_names

# @app.get('/get_all_mesurments')
# def get_all_mesurments():
#     dmes = {}
#     tkeys = list(data.keys())
#     for x in tkeys:
#         gatemp = data.get(x, {}).get('temp')
#         gahum = data.get(x, {}).get('hum')
#         gapress = data.get(x, {}).get('press')
#         if gatemp == None and gahum == None and gapress == None:
#             pass

#         else:
#             dmes[x] = {'temp': gatemp, 'hum': gahum, 'press': gapress}
        
#     return dmes

# @app.get('/get_temperature')
# def get_temp():
#     dtemp = {}
#     tkeys = list(data.keys())
#     for x in tkeys:
#         gtemp = data.get(x, {}).get('temp')
#         gname = data.get(x, {}).get('soba')
#         if gtemp == None:
#             pass

#         else:
#             dtemp[x] = {'ime': gname, 'podatki': gtemp}
        
#     return dtemp

# @app.get('/get_humidity')
# def get_humidity():
#     dhum = {}
#     tkeys = list(data.keys())
#     for x in tkeys:
#         ghum = data.get(x, {}).get('hum')
#         gname = data.get(x, {}).get('soba')
#         if ghum == None:
#             pass

#         else:
#             dhum[x] = {'ime': gname, 'podatki': ghum}
    
#     return dhum

# @app.get('/get_pressure')
# def get_pressure():
#     dpress = {}
#     tkeys = list(data.keys())
#     for x in tkeys:
#         gpress = data.get(x, {}).get('press')
#         gname = data.get(x, {}).get('soba')
#         if gpress == None:
#             pass

#         else:
#             dpress[x] = {'ime': gname, 'podatki': gpress}
    
#     return dpress

# @app.get('/get_room_meas')
# def get_room_meas():
#     roomid = request.args.get('room', default="???", type=str)
#     rtemp = data.get(roomid, {}).get('temp')
#     rhum = data.get(roomid, {}).get('hum')
#     rpress = data.get(roomid, {}).get('press')
        
#     return {'temp': rtemp, 'hum': rhum, 'press': rpress}
#---------------------------------------------------

#RESTAPI2-------------------------------------------
@app.get('/get_all_mesurments2')
def get_all_mesurments2():
    dmes = {}
    roomids = list(data2.keys())
    for roomid in roomids:
        gatemp = data2.get(roomid, {}).get('temp')
        gahum = data2.get(roomid, {}).get('hum')
        gapress = data2.get(roomid, {}).get('press')
        if gatemp == None and gahum == None and gapress == None:
            pass

        else:
            dmes[roomid] = {'temp': gatemp, 'hum': gahum, 'press': gapress}
        
    return dmes

@app.get('/get_temperature2')
def get_temp2():
    dtemp = {}
    tkeys = list(data2.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        gtemp = data2.get(x, {}).get('temp')
        if gtemp == None:
            pass

        else:
            dtemp[x] = {"graphd": gtemp, "ime": ime} 
        
    return dtemp

@app.get('/get_humidity2')
def get_humidity2():
    dhum = {}
    tkeys = list(data2.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        ghum = data2.get(x, {}).get('hum')
        if ghum == None:
            pass

        else:
            dhum[x] = {"graphd": ghum, "ime": ime} 
    
    return dhum

@app.get('/get_pressure2')
def get_pressure2():
    dpress = {}
    tkeys = list(data2.keys())
    for x in tkeys:
        ime = imena.get(x, {})
        gpress = data2.get(x, {}).get('press')
        if gpress == None:
            pass

        else:
            dpress[x] = {"graphd": gpress, "ime": ime} 
    
    return dpress

@app.get('/get_room_meas2')
def get_room_meas2():
    roomid = request.args.get('room', default="???", type=str)
    rtemp = data2.get(roomid, {}).get('temp')
    rhum = data2.get(roomid, {}).get('hum')
    rpress = data2.get(roomid, {}).get('press')
        
    return {'temp': rtemp, 'hum': rhum, 'press': rpress}

@app.get('/get_all_room_names2')
def get_all_room_names2():
    return imena

@app.get('/get_roomname2')
def get_roomname2():
    roomid = request.args.get('room', default="???", type=str)
    imesobe = imena.get(roomid, {})

    return {'room_id': roomid, 'soba': imesobe}

@app.get('/all_last_mesurments2')
def get_all_last_mesurments2():
    amhum = 0
    ampress = 0
    amtemp = 0
    dall_last_mesurments = {}
    keys = list(data2.keys())

    for i in keys:
        listtemp = data2.get(i, {}).get('temp')
        if  listtemp != None:
            for item in listtemp:
                amtemp = item.get("val", {})
        else:
            pass
        listhum = data2.get(i, {}).get('hum')
        if  listhum != None:
            for item in listhum:
                amhum = item.get("val", {})
        else:
            pass
        listpress = data2.get(i, {}).get('press')
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
    return data2

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

