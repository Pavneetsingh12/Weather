// API configuration
const APIKEY = "8ccbc1150d11edd36a45f1da491efe3f";
const URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// DOM elements
const searchBox = document.getElementById("city");
const searchBtn = document.getElementById("btn");
const locationBtn = document.getElementById("location-btn");
const weatherIcon = document.querySelector(".weather-icon");
const lastUpdatedSpan = document.getElementById("last-updated");

// Map weather conditions to appropriate icons
const weatherIconMap = {
    "Clear": "weather1.png",
    "Clouds": "weather1.png",
    "Rain": "weather.png",
    "Drizzle": "weather.png",
    "Mist": "weather.png",
    "Snow": "weather.png",
    "Thunderstorm": "weather.png",
    "Fog": "weather.png",
    "Haze": "weather.png"
};

// Format the current time
function formatTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to get weather by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error);
        document.querySelector(".city").innerHTML = "Error fetching data";
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Handle error responses
    if (data.cod === "404") {
        document.querySelector(".city").innerHTML = "City not found";
        return;
    }
    
    // Update UI with weather data
    document.querySelector(".city").innerHTML = data.name + ", " + data.sys.country;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".weather-desc").innerHTML = data.weather[0].description;
    document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + "°c";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    
    // Update weather icon based on weather condition
    const weatherCondition = data.weather[0].main;
    weatherIcon.src = weatherIconMap[weatherCondition] || "weather1.png";
    
    // Update last updated time
    lastUpdatedSpan.innerHTML = formatTime();
    
    // Make weather display visible
    document.querySelector(".weather").style.display = "block";
}

// Main function to fetch and display weather data
async function checkWeather(city = 'tunisia') {
    try {
        // Show loading state
        document.querySelector(".city").innerHTML = "Loading...";
        
        // Fetch data from OpenWeatherMap API
        const response = await fetch(URL + city + `&appid=${APIKEY}`);
        const data = await response.json();
        
        // Update UI with weather data
        updateWeatherUI(data);
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".city").innerHTML = "Error fetching data";
    }
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        // Show loading state
        document.querySelector(".city").innerHTML = "Getting location...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoordinates(lat, lon);
            },
            (error) => {
                console.error("Error getting location:", error);
                document.querySelector(".city").innerHTML = "Location access denied";
                checkWeather(); // Fall back to default
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
        checkWeather(); // Fall back to default
    }
}

// Event listeners
searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        checkWeather(searchBox.value);
    }
});

searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && searchBox.value.trim() !== "") {
        checkWeather(searchBox.value);
    }
});

locationBtn.addEventListener("click", getUserLocation);

// Load default weather on page load
window.addEventListener("load", () => {
    // Try to get user's location first
    getUserLocation();
});