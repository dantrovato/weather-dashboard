document.addEventListener("DOMContentLoaded", () => {
  // Grab element of interest
  const input = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-button");
  const ul = document.querySelector("#cities");
  const today = document.querySelector("#today");
  ///////////////////////////

  // Api key and query url
  const apiKey = "6ffec2ccc0dfbdef7e5da808207b9287";

  // Make a button with the name of the city entered in the input
  function makeButtonForCity() {
    // Create li and button elements
    const li = document.createElement("li");
    const button = document.createElement("button");
    const city = input.value[0].toUpperCase() + input.value.substring(1);
    // Give the button the capitalised value of the input as text
    button.textContent = city;

    // Append button to li and li to ul
    li.appendChild(button);
    ul.appendChild(li);

    getCoordinates(city);
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

  function getCityInfo(cityData) {
    // grab every 8th
    // console.log(Array.isArray(city.list));
    // console.log(city.list[0].dt_txt);
    const cityName = cityData.city.name;
    const date = cityData.list[0].dt_txt.split(" ")[0];
    const temperature = cityData.list[0].main.temp - 273.15; // - 273.15 converts it into celsius
    const wind = cityData.list[0].wind.speed;
    const humidity = cityData.list[0].main.humidity;
    populateTodayDiv([cityName, date, temperature, wind, humidity]);
  }

  function populateTodayDiv([cityName, date, temperature, wind, humidity]) {
    today.textContent = "";
    const cityData = [
      `${cityName} (${date})`,
      `Temp: ${temperature.toFixed(2)} ℃`,
      `Wind: ${wind} KPH`,
      `Humidity: ${humidity}%`,
    ];
    cityData.forEach((item) => {
      console.log(item);
      const p = document.createElement("p");
      p.textContent = item;
      today.appendChild(p);
    });
  }

  // When the Search button is clicked or entered is pressed we...
  searchBtn.addEventListener("click", (event) => {
    // Stop the form from submitting
    event.preventDefault();
    // Make a button with the name of the city entered in the input
    makeButtonForCity();
    // desc:
    // - make fetch request and grab the response
    // The lat and lon coordinates are needed for the main fetch request. The API doesn't accept the name of the city in its query
  });
});
