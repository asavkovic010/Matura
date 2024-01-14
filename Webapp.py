from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

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

app.run(host='0.0.0.0', port=5000)