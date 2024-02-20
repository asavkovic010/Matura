
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
    console.log("==>> onloadfn()...")
    get_rooms_and_show_rooms()
    get_and_show_mesurments()
}

function get_rooms_and_show_rooms(){

    let url = 'http://127.0.0.1:5000/get_all_room_names'
    let linkold = ''

    get_restapi_data(url).then(data => {
        // console.log(data);
        Object.entries(data).forEach(([roomid, roomname]) => {
            // console.log(`http://172.25.119.98:5000/last_mesurments?room=${roomid}`)
            // console.log(`http://172.25.119.98:5000/soba?room=${roomname}`)
            let link = `<a href="/soba?room=${roomid}">
            <div class ="child">
            <h2>${roomname}</h2>
            <p id="temperatureB${roomid}">Temperatura: </p>
            <p id="humidityB${roomid}">Vlažnost: </p>
            <p id="pressureB${roomid}">Pritisk: </p>
            </div>
            </a>`
            linkold += link;
            
            // document.getElementById("naslov").innerHTML = value;
         });
        
         document.getElementById("glavnidiv").innerHTML = linkold;
      });

}

function get_and_show_mesurments(){
    
    let url = 'http://127.0.0.1:5000/all_last_mesurments'

    get_restapi_data(url).then(data => {
        // console.log(data);
        Object.entries(data).forEach(([roomid, last_mesurments]) => {
            console.log(roomid);
            console.log(last_mesurments);
            document.getElementById(`temperatureB${roomid}`).innerHTML = "Temperatura: " + last_mesurments.temp;
            document.getElementById(`humidityB${roomid}`).innerHTML = "Vlažnost zraka: " + last_mesurments.hum;
            document.getElementById(`pressureB${roomid}`).innerHTML = "Zračni tlak: " + last_mesurments.press;

         });
        

      });
    
    // let url = 'http://172.25.119.98:5000/last_mesurments?room=1'

    // get_restapi_data(url).then(data => {

    //     document.getElementById("temperatureB").innerHTML = "Temperatura: " + data.temp;
    //     document.getElementById("humidityB").innerHTML = "Vlažnost zraka: " + data.hum;
    //     document.getElementById("pressureB").innerHTML = "Zračni pritisk: " + data.press;

    //   });

}

