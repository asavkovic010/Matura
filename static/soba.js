
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
        showlegend: false
      };

      var hlayout = {
        title: 'Vlažnost zraka %',
        showlegend: false
      };

      var playout = {
        title: 'Zračni pritisk hPa',
        showlegend: false
      };
    
      Plotly.newPlot('mytemp', temperatura, tlayout, {displayModeBar: false});
      Plotly.newPlot('myhum', vlaga, hlayout, {displayModeBar: false});
      Plotly.newPlot('mypress', pritisak, playout, {displayModeBar: false});
    
    });

}
