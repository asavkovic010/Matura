
function get_restapi_temp(urlt) {
    return fetch(
        urlt, 
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

function get_restapi_hum(urlh) {
    return fetch(
        urlh, 
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

function get_restapi_press(urlp) {
    return fetch(
        urlp, 
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

function get_restapi_names(urli) {
    return fetch(
        urlp, 
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
    console.log("Onload starting")
    show_graphs()

}

function show_graphs(){
    console.log("show_graphs starting")
    const currentUrl = window.location.href;
    const myString = currentUrl;
    const substring = myString.split('=');
    const meritveid = substring[1].trim();
    console.log(meritveid);

    let urlt = `http://127.0.0.1:5000/get_temperature`
    let urlh = `http://127.0.0.1:5000/get_humidity`
    let urlp = `http://127.0.0.1:5000/get_pressure`
    let graphold = ''

    if(meritveid == "Temperatura"){
        get_restapi_temp(urlt).then(data => {
            Object.entries(data).forEach(([roomid, datat]) => {
                console.log(roomid);
                console.log(datat);
                console.log(datat.podatki);
                console.log(datat.ime);
                let xtemp = [];
                for (let i = -datat.podatki.length + 1; i < 1 ; i++) {
                    xtemp.push(i);
                }
                console.log(xtemp);

                var temptrace = {
                x: xtemp,
                y: datat.podatki,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var tlayout = {
                    title: datat.ime,
                    showlegend: false
                };
                

                var temperatura = [temptrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, temperatura, tlayout, {displayModeBar: false});;
                }, 0);


                let graph = `<div class="graf" id=${roomid}></div>`
                graphold += graph;

            });
            
            console.log("generating divs")
            document.getElementById("glavnidiv").innerHTML = graphold;
            });
        }

    else if(meritveid == "Vla%C5%BEnost%20zraka"){
        get_restapi_temp(urlh).then(data => {
            Object.entries(data).forEach(([roomid, datah]) => {
                console.log(roomid);
                console.log(datah);
                console.log(datah.podatki);
                console.log(datah.ime);
                let xhum = [];
                for (let i = -datah.podatki.length + 1; i < 1 ; i++) {
                    xhum.push(i);
                }
                console.log(xhum);

                var humtrace = {
                x: xhum,
                y: datah.podatki,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var hlayout = {
                    title: datah.ime,
                    showlegend: false
                };
                

                var humidity = [humtrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, humidity, hlayout, {displayModeBar: false});;
                }, 0);


                let graph = `<div class="graf" id=${roomid}></div>`
                graphold += graph;

            });
            
            console.log("generating divs")
            document.getElementById("glavnidiv").innerHTML = graphold;
            });
        }

    else if(meritveid == "Zra%C4%8Dni%20tlak"){
        get_restapi_temp(urlp).then(data => {
            Object.entries(data).forEach(([roomid, datap]) => {
                console.log(roomid);
                console.log(datap);
                console.log(datap.podatki);
                console.log(datap.ime)
                let xpress = [];
                for (let i = -datap.podatki.length + 1; i < 1 ; i++) {
                    xpress.push(i);
                }
                console.log(xpress);

                var presstrace = {
                x: xpress,
                y: datap.podatki,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var playout = {
                    title: datap.ime,
                    showlegend: false
                };
                

                var pressure = [presstrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, pressure, playout, {displayModeBar: false});;
                }, 0);


                let graph = `<div class="graf" id=${roomid}></div>`
                graphold += graph;

            });
            
            console.log("generating divs")
            document.getElementById("glavnidiv").innerHTML = graphold;
            });
        }
    
}
