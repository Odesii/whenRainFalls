const weatherAppAPIKey = "5f1008dc25600c0e8d9ea9d20ea6a3e6";
const button = document.getElementById("searchBtn");

if (document) document.addEventListener("DOMContentLoaded", displayHistory);

button.addEventListener("click", function (event) {
  event.preventDefault();

  let city = document.getElementById("search").value;
  if (city) {
    getWeather(city);
  }
});

function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;
  // Fetch the geolocation data for the city
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Extract the latitude and longitude from the data
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      // Add the city name to the search history
      const cityName = data[0].name;
      addHistory(cityName);

      const currentW = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
      // Fetch the forecast data
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
// builds and displays the Current weather 
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
//Builds and Displays the Five day cards 
function fiveDay(weatherData) {
  let five = document.getElementById("5day");
  five.textContent = "";
  let weather = weatherData.list;
// this function is for reusability to simply replace
// 'i' with the array value to pull that days information
  function createBlock(i) {
    let forecast = document.createElement("div");

    let date = dayjs.unix(weather[i].dt).format("MM-DD-YY");
    let dateEl = document.createElement("h3");
    dateEl.textContent = date;
    forecast.appendChild(dateEl);
    //pulls the icon from openweather for display
    let weatherIcon = document.createElement("img");
    let iconUrl = `https://openweathermap.org/img/wn/${weather[i].weather[0].icon}.png`;
    weatherIcon.src = iconUrl;
    forecast.appendChild(weatherIcon);

    let weatherDetails = document.createElement("ul");

    let tempItem = document.createElement("li");
    tempItem.textContent = `Temp ${weather[i].main.temp}°F`;
    weatherDetails.appendChild(tempItem);

    let humidItem = document.createElement("li");
    humidItem.textContent = `Humidity ${weather[i].main.humidity}%`;
    weatherDetails.appendChild(humidItem);

    let windItem = document.createElement("li");
    windItem.textContent = ` Wind Speed ${Math.floor(
      weather[i].wind.speed / 1.467
    )} MPH`;
    weatherDetails.appendChild(windItem);

    forecast.appendChild(weatherDetails);
    five.appendChild(forecast);
  }
//  calls each day for the five day
  createBlock(9);
  createBlock(17);
  createBlock(25);
  createBlock(33);
  createBlock(39);
}

// Function to add a city name to the search history in localStorage
function addHistory(cityName) {
  // Try to retrieve the current search history from localStorage, or initialize an empty array if none found
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Check if the city name is already in the history to avoid duplicates
  if (!history.includes(cityName)) {
    // If the city name is not already in the history, add it
    history.push(cityName);
  }

  // Save the updated history back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(history));

  // Update the display of search history on the webpage
  displayHistory();
}

// Function to display the search history as a list of buttons
function displayHistory() {
  // Retrieve the search history from localStorage
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  // Get the element where the search history should be displayed
  let display = document.getElementById("searchHistory");
  // Clear any existing content in the search history display
  display.innerHTML = "";

  // Loop through each city in the history
  history.forEach((city) => {
    // Create a new button element for each city
    let cityEl = document.createElement("button");
    // Add a class to the button for styling and identification
    cityEl.classList.add("previous");

    // Set the button's text to the city name
    cityEl.textContent = city;

    // Add the newly created button to the search history display element
    display.appendChild(cityEl);
  });
}

// Listen for the 'DOMContentLoaded' event to ensure the script runs after the HTML document has been fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add a click event listener to the whole document
  document.addEventListener("click", function (event) {
    // Check if the clicked element has the 'previous' class
    if (event.target && event.target.classList.contains("previous")) {
      // Prevent the default action for the click event
      event.preventDefault();
      // Retrieve the city name from the text content of the clicked button
      let oldCity = event.target.textContent;
      // If a city name was found, fetch and display its weather data
      if (oldCity) {
        getWeather(oldCity);
      }
    }
  });
});