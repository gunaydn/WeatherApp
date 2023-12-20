
// document.addEventListener('DOMContentLoaded', function () {
//     var input = document.getElementById('input');
//     var city = document.getElementById('cityName');
//     var temperature = document.getElementById('temperature');
//     var humidity = document.getElementById('humidity');
//     var weather = document.getElementById('weather');
//     var btn = document.getElementById('submitBtn');

//     function checkWeather() {
//         btn.addEventListener('click', function (name) {
//             console.log(input.value);
//             fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value +
//                 '&appid=6f749b9cb201e184bb4d4ee81c2e115d&units=metric')
//                 .then(response => response.json())
//                 .then(data => {
//                     var tempValue = data['main']['temp'];
//                     var cityValue = data['name'];
//                     var weatherValue = data['weather'][0]['description'];
//                     var humidityValue = data['main']['humidity'];

//                     city.innerHTML = 'Weather at ' + cityValue;
//                     weather.innerHTML = 'Weather: ' + weatherValue;
//                     temperature.innerHTML = 'Temperature: ' + tempValue + ' Celsius';
//                     humidity.innerHTML = 'Humidity: ' + humidityValue;
//                 })
//                 .catch(err => alert('Wrong city name!'));
//         });
//     }

//     // Call the function to set up the event listener
//     checkWeather();
// });


document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('input');
    var btn = document.getElementById('submitBtn');
    var card = document.querySelector('.card');
    var loaderContainer = document.getElementById('loaderContainer');

    btn.addEventListener('click', function () {
        
        console.log(input.value);
        loaderContainer.innerHTML = '<div class="loader"></div>';
        setTimeout(() => {
            fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value +
            '&appid=6f749b9cb201e184bb4d4ee81c2e115d&units=metric')
            .then(response => response.json())
            .then(data => {
                loaderContainer.innerHTML = '';
                // Remove existing weather container if it exists
                var existingWeatherContainer = document.getElementById('weatherContainer');
                if (existingWeatherContainer) {
                    existingWeatherContainer.remove();
                }

                // Create a new weather container
                var weatherContainer = document.createElement('div');
                weatherContainer.id = 'weatherContainer';

                // Create and append elements to the weather container
                var cityElement = document.createElement('h3');
                cityElement.textContent = data.name;

                var weatherElement = document.createElement('p');
                const desc = data.weather[0].description;
                weatherElement.textContent = capitalizeFirstLetter(desc);

                var temperatureElement = document.createElement('p');
                var temperature = Math.round(data.main.temp);
                temperatureElement.textContent = temperature + '°';

                var humidityElement = document.createElement('p');
                humidityElement.textContent = 'Humidity: ' + data.main.humidity;

                // Append elements to the weather container
                weatherContainer.appendChild(cityElement);
                weatherContainer.appendChild(weatherElement);
                weatherContainer.appendChild(temperatureElement);
                weatherContainer.appendChild(humidityElement);

                // Append the weather container to the card div
                card.appendChild(weatherContainer);
            })
            .catch(err => alert('Wrong city name!'));
        },2000);
        
    });
});


function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}