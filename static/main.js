
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
    get_rooms()
    temporary()
}

function get_rooms(){

    let url = 'http://172.25.119.98:5000/get_all_room_names'
    let linkold = ''

    get_restapi_data(url).then(data => {
        console.log(data);
        Object.entries(data).forEach(([key, value]) => {
            console.log(key)
            console.log(value)
            console.log(`http://172.25.119.98:5000/last_mesurments?room=${key}`)
            console.log(`http://172.25.119.98:5000/soba?room=${value}`)
            let link = `<a href="/soba?room=${value}">${value}</a>`
            linkold += link;
            console.log(link)
            
            // document.getElementById("naslov").innerHTML = value;
         });
        
         document.getElementById("glavnidiv").innerHTML = linkold;
      });

}

function temporary(){
    
    let url = 'http://172.25.119.98:5000/last_mesurments?room=1'

    get_restapi_data(url).then(data => {

        document.getElementById("temperatureB").innerHTML = "Temperatura: " + data.temp;
        document.getElementById("humidityB").innerHTML = "Vlažnost zraka: " + data.hum;
        document.getElementById("pressureB").innerHTML = "Zračni pritisk: " + data.press;

      });

}