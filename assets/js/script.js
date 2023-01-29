// done:
//

// todo:

// bonus:
// Add delete button
// Add autocomplete to the input
// Colour header
// Fine tune positoning
document.addEventListener("DOMContentLoaded", () => {
  // Grab elements of interest
  const input = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-button");
  const cities = document.querySelector("#cities");
  const today = document.querySelector("#today");
  const fiveDayDiv = document.querySelector("#five-days");
  ///////////////////////////

  // Api key and query url
  const apiKey = "6ffec2ccc0dfbdef7e5da808207b9287";

  // If the localStorage doesn't include the city it grabs and stores it
  // It would look like this: cityNameForWeatherApp-London: 'London'
  function storeCityInLocalStorage(city) {
    if (localStorage[`cityNameForWeatherApp-${city}`] !== city) {
      localStorage[`cityNameForWeatherApp-${city}`] = city;
    }
  }

  // Make a button with the name of the city entered in the input and store it in the localStorage
  function makeButtonForCity() {
    // Create li and button elements
    const li = document.createElement("li");
    const button = document.createElement("button");
    const city = input.value[0].toUpperCase() + input.value.substring(1);
    input.value = "";
    // Give the button the capitalised value of the input as text
    button.textContent = city;

    // Append button to li and li to ul
    li.appendChild(button);
    cities.appendChild(li);

    getCoordinates(city);
    storeCityInLocalStorage(city);
  }

  function getCoordinates(city) {
    const coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(coordinatesUrl)
      .then((response) => response.json())
      .then((city) => {
        const lat = city[0].lat;
        const lon = city[0].lon;
        return [lat, lon];
      })
      .then(([lat, lon]) => {
        const queryUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        return fetch(queryUrl);
      })
      .then((response) => response.json())
      .then((city) => getCityInfo(city));
  }

  function formatCard(date, icon, temperature, wind, humidity) {
    return `<div class="card" style="width: 11.5rem">
              <div class="card-body">
              <p class="five-day-forcast-date">${date.replace(/-/g, "/")}</p>
              <p>${icon}</p>
              <p>Temp: ${temperature.toFixed(2)} ℃</p>
              <p>Wind: ${wind} KPH</p>
              <p>Humidity: ${humidity}%</p>
              </div>
            </div>`;
  }

  function populateFiveDayDiv(cityData) {
    // Clear the div from the previous 5 days
    fiveDayDiv.innerHTML = "";
    // The list gives 40 results 3 hours apart so we grab every 7th result to make sure they're all at the same time one day apart
    // I also changed the indexes array below to start at 7 instead of 8 because there is no element at index 40
    const indexes = [7, 15, 23, 31, 39];
    const list = cityData.list.filter((result, idx) => {
      if (indexes.includes(idx)) return result;
    });

    list.forEach((day) => {
      const date = formatDate(day);
      const iconCode = day.weather[0].icon;
      const icon = `<img src="http://openweathermap.org/img/w/${iconCode}.png"`;
      const kelvin = day.main.temp;
      const temperature = getCelsius(kelvin);
      const wind = day.wind.speed;
      const humidity = day.main.humidity;
      const cardHTML = formatCard(date, icon, temperature, wind, humidity);
      const div = document.createElement("div");
      div.innerHTML = cardHTML;
      fiveDayDiv.appendChild(div);
    });
  }

  // Swaps - for / and reorders year month and day
  function formatDate(day) {
    const date = day.dt_txt.split(" ")[0];
    const regexp = /(\d+)-(\d+)-(\d+)/;
    const matches = date.match(regexp);
    const formattedDate = `${matches[3]}/${matches[2]}/${matches[1]}`;
    return formattedDate;
  }

  function getCelsius(kelvin) {
    // - 273.15 converts it into celsius
    return kelvin - 273.15;
  }

  function getCityInfo(cityData) {
    // grab every 8th
    // console.log(Array.isArray(city.list));
    // console.log(city.list[0].dt_txt);

    const cityName = cityData.city.name;
    const iconCode = cityData.list[0].weather[0].icon;
    const icon = `<img src="http://openweathermap.org/img/w/${iconCode}.png"`;
    const date = formatDate(cityData.list[0]);
    const kelvin = cityData.list[0].main.temp;
    const temperature = getCelsius(kelvin);
    const wind = cityData.list[0].wind.speed;
    const humidity = cityData.list[0].main.humidity;
    populateTodayDiv([cityName, date, icon, temperature, wind, humidity]);
    populateFiveDayDiv(cityData);
  }

  function populateTodayDiv([
    cityName,
    date,
    icon,
    temperature,
    wind,
    humidity,
  ]) {
    const html = `<p id="city-and-date" class="pad">${cityName} (${date}) ${icon}</p>
                  <p class="pad">Temp: ${temperature.toFixed(2)} ℃</p>
                  <p class="pad">Wind: ${wind} KPH</p>
                  <p class="pad">Humidity: ${humidity}%</p>`;
    today.innerHTML = html;
  }

  function populateCitiesFromLocalStorage() {
    // Get array of citiesKeys from localStorage
    const citiesKeys = Object.keys(localStorage).filter((key) =>
      key.includes("cityNameForWeatherApp-")
    );

    // With the citiesKeys we got above get an array of the city names
    const citiesNames = citiesKeys.map((key) => localStorage[key]);

    // Loop over the names and for each one make button and apped it to the cities div under the search button
    citiesNames.forEach((city) => {
      // Create li and button elements
      const li = document.createElement("li");
      const button = document.createElement("button");

      input.value = "";
      button.textContent = city;

      // Append button to li and li to ul
      li.appendChild(button);
      cities.appendChild(li);
    });
  }

  // When the Search button is clicked or entered is pressed we...
  searchBtn.addEventListener("click", (event) => {
    // Stop the form from submitting
    event.preventDefault();
    // Make a button with the name of the city entered in the input and store it in the localStorage
    makeButtonForCity();
  });

  // Any click on any of the cities on the left panel sends a fresh fetch request to update the #today div
  cities.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const city = event.target.textContent;
      getCoordinates(city);
    }
  });

  populateCitiesFromLocalStorage();
});
