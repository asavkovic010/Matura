
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
            console.log("response:")
            console.log(response)
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
      console.log("pozivam set time")
      set_time()
  }, 1000);
  set_nav_hight()

}

function show_graphs(){
    const currentUrl = window.location.href;
    console.log(currentUrl);
    const myString = currentUrl;
    const stringLength = myString.length;
    let roomid = myString.charAt(stringLength - 1)
    console.log('lastChar: ', roomid); // this will be the string

    let url = `http://127.0.0.1:5000/get_room_meas?room=${roomid}`
    

    get_restapi_data(url).then(data => {
      let xtemp = [];
      for (let i = -data.temp.length + 1; i < 1 ; i++) {
          xtemp.push(i);
      }
      console.log(xtemp);

      let xhum = [];
      for (let i = -data.hum.length + 1; i < 1 ; i++) {
          xhum.push(i);
      }

      let xpress = [];
      for (let i = -data.press.length + 1; i < 1 ; i++) {
          xpress.push(i);
      }

      
      var temptrace = {
        x: xtemp,
        y: data.temp,
        mode: 'lines+markers',
        type: 'scatter'
      };

      var humtrace = {
        autosize: true,
        x: xhum,
        y: data.hum,
        mode: 'lines+markers',
        type: 'scatter'
      };

      var presstrace = {
        x: xpress,
        y: data.press,
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
