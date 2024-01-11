from flask import Flask, render_template

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

app.run(host='0.0.0.0', port=5000)