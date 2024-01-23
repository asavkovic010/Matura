
function get_restapi_data2(url) {
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

    let url = 'http://172.25.119.98:5000/last_mesurments?room=1'

    get_restapi_data2(url).then(data => {
        // console.log("b4 show_data..");
        console.log(data);
        
        document.getElementById("temperatureDS").innerHTML = "Temperatura: " + data.temp;
        document.getElementById("humidityDS").innerHTML = "Vlažnost zraka: " + data.hum;
        document.getElementById("pressureDS").innerHTML = "Zračni pritisk: " + data.press;

        // show_data(data);
      });

}