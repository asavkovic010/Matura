
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
    console.log("==>> onloadfn()...")
    get_rooms_and_show_rooms()
    get_and_show_mesurments()
    setInterval(() => {
        get_and_show_mesurments()
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

function get_rooms_and_show_rooms(){

    let url = 'http://127.0.0.1:5000/get_all_room_names'
    let linkold = ''

    get_restapi_data(url).then(data => {
        Object.entries(data).forEach(([roomid, roomname]) => {
            let link = `<a href="/soba?room=${roomid}">
            <div class="card">
            <h2>${roomname}</h2>
            <p id="temperatureB${roomid}">Temperatura: </p>
            <p id="humidityB${roomid}">Vlažnost: </p>
            <p id="pressureB${roomid}">Pritisk: </p>
            <p id="statusB${roomid}">Status: </p>
            </div>
            </a>`
            linkold += link;
            
         });
        
         document.getElementById("glavnidiv").innerHTML = linkold;
      });

}

function get_and_show_mesurments(){
    let url = 'http://127.0.0.1:5000/all_last_mesurments'

    get_restapi_data(url).then(data => {
        Object.entries(data).forEach(([roomid, last_mesurments]) => {
            document.getElementById(`temperatureB${roomid}`).innerHTML = "Temperatura: " + last_mesurments.temp + " ºC";
            document.getElementById(`humidityB${roomid}`).innerHTML = "Vlažnost zraka: " + last_mesurments.hum + " %";
            document.getElementById(`pressureB${roomid}`).innerHTML = "Zračni tlak: " + last_mesurments.press + " hPa";
            document.getElementById(`statusB${roomid}`).innerHTML = "Status: " + last_mesurments.status;


         });
        

      });
    
}
