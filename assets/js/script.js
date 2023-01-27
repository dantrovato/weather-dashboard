document.addEventListener("DOMContentLoaded", () => {
  // Grab element of interest
  const input = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-button");
  const ul = document.querySelector("#cities");
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
    let lat = 51.5085;
    let lon = -0.1257;
    // const queryUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(coordinatesUrl)
      .then((response) => response.json())
      .then((res) => console.log(res));
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
