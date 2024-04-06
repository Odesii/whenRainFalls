const weatherAppAPIKey = "5f1008dc25600c0e8d9ea9d20ea6a3e6";
const button = document.getElementById("searchBtn");

button.addEventListener("click", function (event) {
  event.preventDefault();

  let city = document.getElementById("search").value;
  if (city) {
    getWeather(city);
    addHistory(city);
    forecast(city);
  }
});



function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log("--------- First request with geolocation --------")
      // console.log(data);

      const latitude = data[0].lat;
      const longitude = data[0].lon;
      // console.log(latitude, longitude);

      const forecast = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;

      fetch(forecast)
        .then(function (response2) {
          return response2.json();
        })
        .then(function (data2) {
        //   console.log("--------- Second request with current weather --------");
        //   console.log(data2);
          displayCurrent(data2);
        });
    });
}

function forecast(city){
    const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

    fetch(weatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log("--------- First request with geolocation --------")
        // console.log(data);
  
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        // console.log(latitude, longitude);
  
        const forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
        fetch(forecast)
        .then(function (response2) {
          return response2.json();
        })
        .then(function (data2) {
          console.log("--------- Second request with current weather --------");
          console.log(data2);
        });

});
}

function displayCurrent(weatherData) {
    let currentWeatherEl = document.getElementById("mainWeather");
    currentWeatherEl.textContent = ''; // Clear existing content
  
    let mainInsert = document.createElement("div");
  
    // Create and append the city name
    let cityName = document.createElement("h2");
    cityName.textContent = weatherData.name;
    mainInsert.appendChild(cityName);
  
    // Create and append the weather icon
    let weatherIcon = document.createElement("img");
    let baseUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    weatherIcon.src = baseUrl;
    mainInsert.appendChild(weatherIcon);
  
    // Format and append the date
    
    const date = dayjs.unix(weatherData.dt).format('MM-DD-YY');
    let dateEl = document.createElement("h3");
    
    dateEl.textContent = date; 
    mainInsert.appendChild(dateEl);
  
let windSpeed = weatherData.wind.speed
    windSpeed = Math.floor(weatherData.wind.speed / 1.467)

    // Create and append the weather details
    let weatherDetails = document.createElement("p");
    weatherDetails.textContent = `Temp ${weatherData.main.temp}°F, Humidity ${weatherData.main.humidity}%, Wind Speed ${windSpeed}MPH`;
    mainInsert.appendChild(weatherDetails);
  
    // Append the main container to the current weather element
    currentWeatherEl.appendChild(mainInsert);
  }
  





function addHistory(city) {}

// for(let i = 0; i < data2.list.length; i++){
//     console.log(data2.list[i].main.temp)

// }
