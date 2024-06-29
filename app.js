document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("input");
  var weatherBtn = document.getElementById("weatherBtn");
  var forecastBtn = document.getElementById("forecastBtn");
  var card = document.querySelector(".card");
  var loaderContainer = document.getElementById("loaderContainer");
  var errorPopup = document.getElementById("errorPopup");

  function resetBackgroundImage() {
    document.body.style.backgroundImage = "";
  }

  weatherBtn.addEventListener("click", function () {
    var existingWeatherContainer = document.getElementById("weatherContainer");
    if (existingWeatherContainer) {
      existingWeatherContainer.remove();
    }
    var existingForecastContainer =
      document.getElementById("forecastContainer");
    if (existingForecastContainer) {
      existingForecastContainer.remove();
    }

    resetBackgroundImage();

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
        .then((response) => {
          if (!response.ok) {
            throw new Error("City not found");
          }
          return response.json();
        })
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
              weatherIconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
              document.body.style.backgroundImage =
                "url(../Icons/cloudy_bg.png)";
              break;
            case "Rain":
              weatherIconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
              document.body.style.backgroundImage =
                "url(../Icons/rainy_bg.png)";
              break;
            case "Clear":
              weatherIconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
              document.body.style.backgroundImage =
                "url(../Icons/clearSky_bg.png)";
              break;
            case "Snow":
              weatherIconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
              document.body.style.backgroundImage =
                "url(../Icons/snowy_bg.png)";
              break;
            case "Drizzle":
              weatherIconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
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

          var timeElement = document.createElement("p");

          function updateLocalTime() {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetch(
              `https://api.timezonedb.com/v2.1/get-time-zone?key=GKJ2VXDPEY5E&format=json&by=position&lat=${lat}&lng=${lon}`
            )
              .then((response) => response.json())
              .then((timezoneData) => {
                var localTime = new Date(timezoneData.formatted);
                var hours = localTime.getHours();
                var minutes = localTime.getMinutes();
                minutes = minutes < 10 ? "0" + minutes : minutes;
                timeElement.textContent =
                  "Local Time: " + hours + ":" + minutes;
              })
              .catch((err) => {
                timeElement.textContent = "Could not fetch local time";
              });
          }

          updateLocalTime();
          setInterval(updateLocalTime, 60000);

          weatherContainer.appendChild(cityElement);
          weatherContainer.appendChild(weatherIconImg);
          weatherContainer.appendChild(weatherElement);
          weatherContainer.appendChild(temperatureElement);
          weatherContainer.appendChild(humidityElement);
          weatherContainer.appendChild(timeElement);
          card.appendChild(weatherContainer);
        })
        .catch((err) => {
          loaderContainer.innerHTML = "";
          showErrorPopup(err.message);
        });
    }, 2000);
  });

  forecastBtn.addEventListener("click", function () {
    var existingWeatherContainer = document.getElementById("weatherContainer");
    if (existingWeatherContainer) {
      existingWeatherContainer.remove();
    }
    var existingForecastContainer =
      document.getElementById("forecastContainer");
    if (existingForecastContainer) {
      existingForecastContainer.remove();
    }

    resetBackgroundImage();

    if (input.value === null || input.value.trim() === "") {
      showErrorPopup("Please enter a city!");
      return;
    }

    loaderContainer.innerHTML = '<div class="loader"></div>';
    setTimeout(() => {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          input.value
        )}&appid=6f749b9cb201e184bb4d4ee81c2e115d&units=metric`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("City not found");
          }
          return response.json();
        })
        .then((forecastData) => {
          loaderContainer.innerHTML = "";
          var forecastContainer = document.createElement("div");
          forecastContainer.id = "forecastContainer";
          forecastContainer.style.overflowX = "auto";

          const dailyData = {};
          forecastData.list.forEach((entry) => {
            const date = entry.dt_txt.split(" ")[0];
            if (!dailyData[date]) {
              dailyData[date] = {
                temps: [],
                descriptions: [],
                icons: [],
              };
            }
            dailyData[date].temps.push(entry.main.temp);
            dailyData[date].descriptions.push(entry.weather[0].description);
            dailyData[date].icons.push(entry.weather[0].icon);
          });

          const today = new Date().toISOString().split("T")[0];
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split("T")[0];

          Object.keys(dailyData)
            .slice(0, 5)
            .forEach((date) => {
              const data = dailyData[date];
              const avgTemp =
                data.temps.reduce((sum, temp) => sum + temp, 0) /
                data.temps.length;
              const desc = data.descriptions[0]; // First description of the day
              const icon = data.icons[0]; // First icon of the day

              const forecastCard = document.createElement("div");
              forecastCard.className = "forecast-card";

              const dateElement = document.createElement("p");

              if (date === today) {
                dateElement.textContent = "Today";
              } else if (date === tomorrowStr) {
                dateElement.textContent = "Tomorrow";
              } else {
                dateElement.textContent = new Date(date).toLocaleDateString();
              }

              const descElement = document.createElement("p");
              descElement.textContent = capitalizeFirstLetter(desc);

              const tempElement = document.createElement("p");
              tempElement.textContent = `${Math.round(avgTemp)}°`;

              const iconElement = document.createElement("img");
              iconElement.src = `http://openweathermap.org/img/wn/${icon}.png`;

              forecastCard.appendChild(dateElement);
              forecastCard.appendChild(iconElement);
              forecastCard.appendChild(descElement);
              forecastCard.appendChild(tempElement);
              forecastContainer.appendChild(forecastCard);
            });

          card.appendChild(forecastContainer);
        })
        .catch((error) => {
          loaderContainer.innerHTML = "";
          showErrorPopup("Failed to fetch forecast data: " + error.message);
        });
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
