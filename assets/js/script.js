const weatherAppAPIKey = "5f1008dc25600c0e8d9ea9d20ea6a3e6";
const button = document.getElementById("searchBtn");

button.addEventListener("click", function (event) {
  event.preventDefault();

  let city = document.getElementById("search").value;
  if (city) {
    getWeather(city);
    addHistory(city);
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

      const currentW = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;

      fetch(currentW)
        .then(function (response2) {
          return response2.json();
        })
        .then(function (data2) {
          //   console.log("--------- Second request with current weather --------");
          console.log(data2);
          displayCurrent(data2);
          fiveDay(data2);
        });
    });
}

function displayCurrent(weatherData) {
  let currentWeatherEl = document.getElementById("mainWeather");
  currentWeatherEl.textContent = ""; // Clear existing content

  let mainInsert = document.createElement("div");

  // Create and append the city name
  let cityName = document.createElement("h2");
  cityName.textContent = weatherData.city.name;
  mainInsert.appendChild(cityName);

  // Create and append the weather icon
  let weatherIcon = document.createElement("img");
  let iconUrl = `https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`;
  weatherIcon.src = iconUrl;
  mainInsert.appendChild(weatherIcon);

  // Format and append the date

  const date = dayjs.unix(weatherData.list[0].dt).format("MM-DD-YY");
  let dateEl = document.createElement("h3");

  dateEl.textContent = date;
  mainInsert.appendChild(dateEl);

  let windSpeed = Math.floor(weatherData.list[0].wind.speed / 1.467);

  // Create and append the weather details
  let weatherDetails = document.createElement("p");
  weatherDetails.textContent = `Temp ${weatherData.list[0].main.temp}°F, Humidity ${weatherData.list[0].main.humidity}%, Wind Speed ${windSpeed}MPH`;
  mainInsert.appendChild(weatherDetails);

  // Append the main container to the current weather element
  currentWeatherEl.appendChild(mainInsert);
}

function fiveDay(weatherData) {
  let five = document.getElementById("5day");
  five.textContent = "";
  let weather = weatherData.list;

  function createBlock(i) {
    let forecast = document.createElement("div");

    let date = dayjs.unix(weather[i].dt).format("MM-DD-YY");
    let dateEl = document.createElement("h3");
    dateEl.textContent = date;
    forecast.appendChild(dateEl);

    let weatherIcon = document.createElement("img");
    let iconUrl = `https://openweathermap.org/img/wn/${weather[i].weather[0].icon}.png`;
    weatherIcon.src = iconUrl;
    forecast.appendChild(weatherIcon);

    // Create and append the weather details
    let weatherDetails = document.createElement("ul");

    let tempItem = document.createElement("li");
    tempItem.textContent = `Temp ${weather[i].main.temp}°F`;
    weatherDetails.appendChild(tempItem);

    let humidItem = document.createElement("li");
    humidItem.textContent = `Humidity ${weather[i].main.humidity}%`;
    weatherDetails.appendChild(humidItem);

    let windItem = document.createElement("li");
    windItem.textContent = ` Wind Speed ${Math.floor(
      weather[i].wind.speed / 1.467)} MPH`;
    weatherDetails.appendChild(windItem);

    forecast.appendChild(weatherDetails);
    five.appendChild(forecast);
  }

  createBlock(9);
  createBlock(17);
  createBlock(25);
  createBlock(33);
  createBlock(39);
}

function addHistory(city) {
}
