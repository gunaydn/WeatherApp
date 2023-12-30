document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("input");
  var btn = document.getElementById("submitBtn");
  var card = document.querySelector(".card");
  var loaderContainer = document.getElementById("loaderContainer");
  var errorPopup = document.getElementById("errorPopup");
  var cloudyIcon = "../Icons/cloudy128px_icon.png";
  var rainyIcon = "../Icons/rainy128px_icon.png";
  var snowyIcon = "../Icons/snowy128px_icon.png";
  var sunnyIcon = "../Icons/clear128px_icon.png";
  var drizzleIcon = "../Icons/drizzle128px_icon.png";

  btn.addEventListener("click", function () {
    var existingWeatherContainer = document.getElementById("weatherContainer");
    if (existingWeatherContainer) {
      existingWeatherContainer.remove();
    }

    if (input.value === null || input.value.trim() === "") {
      showErrorPopup("Please enter a city!");
      return;
    }

    loaderContainer.innerHTML = '<div class="loader"></div>';
    setTimeout(() => {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          input.value +
          "&appid=6f749b9cb201e184bb4d4ee81c2e115d&units=metric"
      )
        .then((response) => response.json())
        .then((data) => {
          loaderContainer.innerHTML = "";
          var weatherContainer = document.createElement("div");
          weatherContainer.id = "weatherContainer";

          var cityElement = document.createElement("h2");
          cityElement.textContent = data.name + " , " + data["sys"]["country"];

          var weatherElement = document.createElement("p");
          const desc = data.weather[0].description;
          var weatherIconImg = document.createElement("img");

          switch (data.weather[0].main) {
            case "Clouds":
              weatherIconImg.src = cloudyIcon;
              document.body.style.backgroundImage =
                "url(../Icons/cloudy_bg.png)";
              break;
            case "Rain":
              weatherIconImg.src = rainyIcon;
              document.body.style.backgroundImage =
                "url(../Icons/rainy_bg.png)";
              break;
            case "Clear":
              weatherIconImg.src = sunnyIcon;
              document.body.style.backgroundImage =
                "url(../Icons/clearSky_bg.png)";
              break;
            case "Snow":
              weatherIconImg.src = snowyIcon;
              document.body.style.backgroundImage =
                "url(../Icons/snowy_bg.png)";
              break;
            case "Drizzle":
              weatherIconImg.src = drizzleIcon;
              document.body.style.backgroundImage =
                "url(../Icons/drizzle_bg.png)";
              break;
          }
          weatherElement.textContent = capitalizeFirstLetter(desc);

          var temperatureElement = document.createElement("p");
          var temperature = Math.round(data.main.temp);
          temperatureElement.textContent = temperature + "°";

          var humidityElement = document.createElement("p");
          humidityElement.textContent = "Humidity: " + data.main.humidity;

          weatherContainer.appendChild(cityElement);
          weatherContainer.appendChild(weatherIconImg);
          weatherContainer.appendChild(weatherElement);
          weatherContainer.appendChild(temperatureElement);
          weatherContainer.appendChild(humidityElement);
          card.appendChild(weatherContainer);
        })
        .catch((err) => alert("Wrong city name!"));
    }, 2000);
  });
});

function capitalizeFirstLetter(inputString) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

function showErrorPopup(message) {
  errorPopup.innerText = message;
  errorPopup.classList.add("show");

  setTimeout(() => {
    hideErrorPopup();
  }, 3000);
}

function hideErrorPopup() {
  errorPopup.classList.remove("show");
}
