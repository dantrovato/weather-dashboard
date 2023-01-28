document.addEventListener("DOMContentLoaded", () => {
  // Grab elements of interest
  const input = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-button");
  const cities = document.querySelector("#cities");
  const today = document.querySelector("#today");
  const fiveDayDiv = document.querySelector("#forecast");
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
    cities.appendChild(li);

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

  function populateFiveDayDiv(cityData) {
    // The list gives 40 results 3 hours apart so we grab every 7th result to make sure they're all at the same time one day apart
    const indexes = [0, 8, 16, 24, 32];
    const list = cityData.list.filter((result, idx) => {
      if (indexes.includes(idx)) return result;
    });

    list.forEach((item) => {
      const cardHTML = `<div class="card" style="width: 12rem">
                      <div class="card-body">yo</div>
                    </div>`;
      const div = document.createElement("div");
      div.innerHTML = cardHTML;
      fiveDayDiv.appendChild(div);
      // console.log(fiveDayDiv);
    });
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
    populateFiveDayDiv(cityData);
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

  // Any click on any of the cities on the left panel sends a fresh fetch request to update the #today div
  cities.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const city = event.target.textContent;
      getCoordinates(city);
    }
  });
});
