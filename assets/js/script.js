const weatherAppAPIKey = "5f1008dc25600c0e8d9ea9d20ea6a3e6"
const button = document.getElementById("searchBtn");

button.addEventListener("click", function(event){
    event.preventDefault();

    let city = document.getElementById("search").value;
    if(city){
        getWeather(city);
        addHistory(city);
    
    }
});

function getWeather(city){
    const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;
    
    fetch(weatherUrl).then(function(response){
        return response.json();
    }).then(function(data){
        displayWeather(data);
        console.log("--------- First request with geolocation --------")
        console.log(data);

        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log(latitude, longitude);

        const forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;

        fetch(forecast).then(function(response2) {
            return response2.json();
        }).then(function(data2){
            console.log("--------- Second request with forecast --------")
            console.log(data2);
            for(let i = 0; i < data2.list.length; i++){
                console.log(data2.list[i].main.temp)
            }
        })

})};

function displayWeather(weatherData){
    let currentWeatherEl = document.getElementById("mainWeather")
    
    let mainInsert =  document.createElement('div')

    mainInsert.innerHTML = `<h2>${weatherData[0].name}</h2>`

    currentWeatherEl.appendChild(mainInsert);
}


function addHistory(city){

}