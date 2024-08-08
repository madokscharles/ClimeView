// Script
const apiKey = '2f7d07b4aa4e8f96af7b2cdf4e5e36ca';
const apiBase = 'https://api.openweathermap.org/data/2.5/';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecast');

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
        cityInput.value = ''; // Clears input after search
    }
});

// Function to fetch weather data
function getWeatherData(city) {
    const currentWeatherUrl = `${apiBase}weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `${apiBase}forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));

    // Fetch 5-day forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

// Function to display current weather data
function displayCurrentWeather(data) {
    if (data.cod === '404') {
        currentWeatherSection.innerHTML = '<p>City not found. Please try again.</p>';
        return;
    }

    const { name, main, weather } = data;
    currentWeatherSection.innerHTML = `
        <h2>Current Weather in ${name}</h2>
        <p>Temperature: ${main.temp}°C</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Function to display 5-day forecast data
function displayForecast(data) {
    if (data.cod === '404') {
        forecastSection.innerHTML = '';
        return;
    }

    const { list } = data;
    forecastSection.innerHTML = '<h2>5-Day Forecast</h2>';
    
    list.forEach((forecast, index) => {
        if (index % 8 === 0) { // Filters data for every 24 hours (8 * 3-hour intervals)
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const temp = forecast.main.temp;
            const condition = forecast.weather[0].description;

            forecastSection.innerHTML += `
                <p>${date}: ${temp}°C - ${condition}</p>
            `;
        }
    });
}
