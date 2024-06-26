
function get_restapi_data(url) {
    return fetch(
        url, 
        {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // console.log("response:")
            // console.log(response)
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function onloadfn() {
    console.log("Hello there")
    show_graphs()
    setInterval(() => {
    show_graphs()
}, 1000);
    setInterval(() => {
      set_time()
  }, 1000);
  set_nav_hight()

}

function set_time(){
    
  const d = new Date();
  let ura = d.getHours()
  let minuta = d.getMinutes()
  if (ura < 10) {
      ura = '0' + ura;
    }
    if (minuta < 10) {
      minuta = '0' + minuta;
    }
  let time = ura+":"+minuta;
  document.getElementById("time").innerHTML = time;
}

function set_nav_hight(){
  var div = document.getElementById('sidenavigation');
  div.style.height = '100vh'; // Change the height to 300px
}

function show_graphs(){
  const currentUrl = window.location.href;
  const myString = currentUrl;
  const stringLength = myString.length;
  let roomid = myString.charAt(stringLength - 1)

  let url = `http://127.0.0.1:5000/get_room_meas?room=${roomid}`
  
  get_restapi_data(url).then(data => {
    let xtemp = []
    let ytemp = []
    for (let i = 0; i < data.temp.length; i++) {
    let temp = data.temp[i];
    let temptime = temp["time"];
    xtemp.push(temptime);
    let tempval = temp["val"];
    ytemp.push(tempval);
    }

    let xhum = []
    let yhum = []
    for (let i = 0; i < data.hum.length; i++) {
    let hum = data.hum[i];
    let humtime = hum["time"];
    xhum.push(humtime);
    let humval = hum["val"];
    yhum.push(humval);
    }

    let xpress = []
    let ypress = []
    for (let i = 0; i < data.press.length; i++) {
    let press = data.press[i];
    let presstime = press["time"];
    xpress.push(presstime);
    let pressval = press["val"];
    ypress.push(pressval);
    }

    
    var temptrace = {
      x: xtemp,
      y: ytemp,
      mode: 'lines+markers',
      type: 'scatter'
    };

    var humtrace = {
      autosize: true,
      x: xhum,
      y: yhum,
      mode: 'lines+markers',
      type: 'scatter'
    };

    var presstrace = {
      x: xpress,
      y: ypress,
      mode: 'lines+markers',
      type: 'scatter'
    };
  
    var temperatura = [temptrace];
    var vlaga = [humtrace];
    var pritisak = [presstrace];
  
    var tlayout = {
      title: 'Temperatura ºC',
      showlegend: false,
      margin: {
        l: 50,
        r: 5,
        b: 50,
        t: 70,
        pad: 3
      },
    };

    var hlayout = {
      title: 'Vlažnost zraka %',
      showlegend: false,
      margin: {
        l: 50,
        r: 5,
        b: 50,
        t: 70,
        pad: 3
      },
    };

    var playout = {
      title: 'Zračni pritisk hPa',
      showlegend: false,
      margin: {
        l: 50,
        r: 5,
        b: 50,
        t: 70,
        pad: 3
      },
    };
  
    Plotly.newPlot('mytemp', temperatura, tlayout, {displayModeBar: false});
    Plotly.newPlot('myhum', vlaga, hlayout, {displayModeBar: false});
    Plotly.newPlot('mypress', pritisak, playout, {displayModeBar: false});
  
  });

}
