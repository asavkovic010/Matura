
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
        urli, 
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
    draw_div2()
    show_graphs2()
    setInterval(() => {
        show_graphs2()
    }, 1000);
    setInterval(() => {
        console.log("pozivam set time")
        set_time()
    }, 1000);
    set_nav_hight()

}

//STARE FUNKCIJE-------------------------
// function draw_div(){
    
//     let urli = `http://127.0.0.1:5000/get_all_room_names `
//     let divold = ''

//     get_restapi_names(urli).then(data => { 
//         Object.entries(data).forEach(([roomid, name]) => {
//             let div = `<div class="graf" id=${roomid}></div>`
//             divold += div;
//         });
//         console.log("generating divs")
//         document.getElementById("glavnidiv").innerHTML = divold;
//     });
// }

// function show_graphs(){
//     console.log("show_graphs starting")
//     const currentUrl = window.location.href;
//     const myString = currentUrl;
//     const substring = myString.split('=');
//     const meritveid = substring[1].trim();
//     console.log(meritveid);

//     let urlt = `http://127.0.0.1:5000/get_temperature`
//     let urlh = `http://127.0.0.1:5000/get_humidity`
//     let urlp = `http://127.0.0.1:5000/get_pressure`
//     let graphold = ''

//     if(meritveid == "Temperatura"){
//         get_restapi_temp(urlt).then(data => {
//             Object.entries(data).forEach(([roomid, datat]) => {
//                 console.log(roomid);
//                 console.log(datat);
//                 console.log(datat.podatki);
//                 console.log(datat.ime);
//                 let xtemp = [];
//                 for (let i = -datat.podatki.length + 1; i < 1 ; i++) {
//                     xtemp.push(i);
//                 }
//                 console.log(xtemp);

//                 var temptrace = {
//                 x: xtemp,
//                 y: datat.podatki,
//                 mode: 'lines+markers',
//                 type: 'scatter'
//                 };

//                 var tlayout = {
//                     title: datat.ime,
//                     showlegend: false,
//                     margin: {
//                         l: 50,
//                         r: 5,
//                         b: 50,
//                         t: 70,
//                         pad: 3
//                       },
//                 };
                

//                 var temperatura = [temptrace];
                
//                 setTimeout(() => {
//                     console.log("drawing graph")
//                     Plotly.newPlot(roomid, temperatura, tlayout, {displayModeBar: false});;
//                 }, 0);
//             });
//             });
//         }

//     else if(meritveid == "Vla%C5%BEnost%20zraka"){
//         get_restapi_temp(urlh).then(data => {
//             Object.entries(data).forEach(([roomid, datah]) => {
//                 console.log(roomid);
//                 console.log(datah);
//                 console.log(datah.podatki);
//                 console.log(datah.ime);
//                 let xhum = [];
//                 for (let i = -datah.podatki.length + 1; i < 1 ; i++) {
//                     xhum.push(i);
//                 }
//                 console.log(xhum);

//                 var humtrace = {
//                 x: xhum,
//                 y: datah.podatki,
//                 mode: 'lines+markers',
//                 type: 'scatter'
//                 };

//                 var hlayout = {
//                     title: datah.ime,
//                     showlegend: false,
//                     margin: {
//                         l: 50,
//                         r: 5,
//                         b: 50,
//                         t: 70,
//                         pad: 3
//                       },
//                 };
                

//                 var humidity = [humtrace];
                
//                 setTimeout(() => {
//                     console.log("drawing graph")
//                     Plotly.newPlot(roomid, humidity, hlayout, {displayModeBar: false});;
//                 }, 0);

//             });
//             });
//         }

//     else if(meritveid == "Zra%C4%8Dni%20tlak"){
//         get_restapi_temp(urlp).then(data => {
//             Object.entries(data).forEach(([roomid, datap]) => {
//                 console.log(roomid);
//                 console.log(datap);
//                 console.log(datap.podatki);
//                 console.log(datap.ime)
//                 let xpress = [];
//                 for (let i = -datap.podatki.length + 1; i < 1 ; i++) {
//                     xpress.push(i);
//                 }
//                 console.log(xpress);

//                 var presstrace = {
//                 x: xpress,
//                 y: datap.podatki,
//                 mode: 'lines+markers',
//                 type: 'scatter'
//                 };

//                 var playout = {
//                     title: datap.ime,
//                     showlegend: false,
//                     margin: {
//                         l: 50,
//                         r: 5,
//                         b: 50,
//                         t: 70,
//                         pad: 3
//                       },
//                 };
                

//                 var pressure = [presstrace];
                
//                 setTimeout(() => {
//                     console.log("drawing graph")
//                     Plotly.newPlot(roomid, pressure, playout, {displayModeBar: false});;
//                 }, 0);

//             });
//             });
//         }
    
// }
//---------------------------------------

//NOVA FUNKCIJE--------------------------
function draw_div2(){
    
    let urli = `http://127.0.0.1:5000/get_all_room_names2 `
    let divold = ''

    get_restapi_names(urli).then(data => { 
        Object.entries(data).forEach(([roomid, name]) => {
            let div = `<div class="graf" id=${roomid}></div>`
            divold += div;
        });
        console.log("generating divs")
        document.getElementById("glavnidiv").innerHTML = divold;
    });
}

function show_graphs2(){
    console.log("show_graphs starting")
    const currentUrl = window.location.href;
    const myString = currentUrl;
    const substring = myString.split('=');
    const meritveid = substring[1].trim();
    console.log(meritveid);

    let urlt = `http://127.0.0.1:5000/get_temperature2`
    let urlh = `http://127.0.0.1:5000/get_humidity2`
    let urlp = `http://127.0.0.1:5000/get_pressure2`
    let graphold = ''

    if(meritveid == "Temperatura"){
        get_restapi_temp(urlt).then(data => {
            Object.entries(data).forEach(([roomid, datat]) => {
                let xtemp = []
                let ytemp = []
                for (let i = 0; i < datat.graphd.length; i++) {
                let temp = datat.graphd[i];
                let temptime = temp["time"];
                xtemp.push(temptime);
                let tempval = temp["val"];
                ytemp.push(tempval);
                }

                var temptrace = {
                x: xtemp,
                y: ytemp,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var tlayout = {
                    title: datat.ime,
                    showlegend: false,
                    margin: {
                        l: 50,
                        r: 5,
                        b: 50,
                        t: 70,
                        pad: 3
                      },
                };
                

                var temperatura = [temptrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, temperatura, tlayout, {displayModeBar: false});;
                }, 0);
            });
            });
        }

    else if(meritveid == "Vla%C5%BEnost%20zraka"){
        get_restapi_temp(urlh).then(data => {
            Object.entries(data).forEach(([roomid, datah]) => {

                let xhum = []
                let yhum = []
                for (let i = 0; i < datah.graphd.length; i++) {
                let hum = datah.graphd[i];
                let humtime = hum["time"];
                xhum.push(humtime);
                let humval = hum["val"];
                yhum.push(humval);
                }

                var humtrace = {
                x: xhum,
                y: yhum,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var hlayout = {
                    title: datah.ime,
                    showlegend: false,
                    margin: {
                        l: 50,
                        r: 5,
                        b: 50,
                        t: 70,
                        pad: 3
                      },
                };
                

                var humidity = [humtrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, humidity, hlayout, {displayModeBar: false});;
                }, 0);

            });
            });
        }

    else if(meritveid == "Zra%C4%8Dni%20tlak"){
        get_restapi_temp(urlp).then(data => {
            Object.entries(data).forEach(([roomid, datap]) => {

                let xpress = []
                let ypress = []
                for (let i = 0; i < datap.graphd.length; i++) {
                let press = datap.graphd[i];
                let presstime = press["time"];
                xpress.push(presstime);
                let pressval = press["val"];
                ypress.push(pressval);
                }

                var presstrace = {
                x: xpress,
                y: ypress,
                mode: 'lines+markers',
                type: 'scatter'
                };

                var playout = {
                    title: datap.ime,
                    showlegend: false,
                    margin: {
                        l: 50,
                        r: 5,
                        b: 50,
                        t: 70,
                        pad: 3
                      },
                };
                

                var pressure = [presstrace];
                
                setTimeout(() => {
                    console.log("drawing graph")
                    Plotly.newPlot(roomid, pressure, playout, {displayModeBar: false});;
                }, 0);

            });
            });
        }
    
}
//---------------------------------------

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
    div.style.height = '1300px'; // Change the height to 300px
}

