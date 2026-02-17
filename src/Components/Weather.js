import React, { useState } from "react";

// OpenWeather API key
const API_KEY = "ca8fb72cb2f34bbaec6a2fd553d337cc";

const WeatherApp = () => {
  // main state values
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch weather for current city
  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name!");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        throw new Error("City not found! Please check the spelling.");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // map condition text to an emoji
  const getWeatherEmoji = (condition) => {
    if (!condition) return "🌤️";
    const c = condition.toLowerCase();
    if (c.includes("clear")) return "☀️";
    if (c.includes("cloud")) return "☁️";
    if (c.includes("rain")) return "🌧️";
    if (c.includes("thunder")) return "⛈️";
    if (c.includes("snow")) return "❄️";
    if (c.includes("mist") || c.includes("fog")) return "🌫️";
    return "🌤️";
  };

  // choose background class based on temperature
  const getBgClass = (temp) => {
    if (temp <= 0) return "bg-cold";
    if (temp <= 15) return "bg-cool";
    if (temp <= 25) return "bg-mild";
    return "bg-hot";
  };

  // final background class for current state
  const bgClass = weatherData
    ? getBgClass(weatherData.main.temp)
    : "bg-default";

  return (
    // outer background wrapper
    <div className={`bg-wrapper ${bgClass}`}>
      {/* main content column */}
      <div className="weather-container">
        {/* header */}
        <div className="weather-header">
          <h1 className="weather-title">
            <span className="weather-title-icon">🌍</span>
            <span>Weather App</span>
          </h1>
          <p>Search any city in the world</p>
        </div>

        {/* search area */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name... e.g. Lahore"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            className="search-input"
          />
          <button
            onClick={getWeather}
            className="search-btn"
            disabled={loading}
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* error message */}
        {error && <div className="error-box">{error}</div>}

        {/* loading state */}
        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Getting weather data...</p>
          </div>
        )}

        {/* weather result card */}
        {weatherData && !loading && (
          <div className="weather-card">
            <h2 className="city-name">
              📍 {weatherData.name}, {weatherData.sys.country}
            </h2>

            <div className="weather-main">
              <span className="weather-emoji">
                {getWeatherEmoji(weatherData.weather[0].main)}
              </span>
              <div>
                <p className="temperature">
                  {Math.round(weatherData.main.temp)}°C
                </p>
                <p className="condition">
                  {weatherData.weather[0].description}
                </p>
              </div>
            </div>

            <p className="feels-like">
              Feels like {Math.round(weatherData.main.feels_like)}°C
            </p>

            {/* extra details */}
            <div className="details-grid">
              <div className="detail-card">
                <span className="detail-icon">💧</span>
                <p className="detail-value">{weatherData.main.humidity}%</p>
                <p className="detail-label">Humidity</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">💨</span>
                <p className="detail-value">{weatherData.wind.speed} m/s</p>
                <p className="detail-label">Wind</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🌡️</span>
                <p className="detail-value">
                  {Math.round(weatherData.main.temp_min)}°C
                </p>
                <p className="detail-label">Min Temp</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🔆</span>
                <p className="detail-value">
                  {Math.round(weatherData.main.temp_max)}°C
                </p>
                <p className="detail-label">Max Temp</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">👁️</span>
                <p className="detail-value">
                  {weatherData.visibility
                    ? `${(weatherData.visibility / 1000).toFixed(1)} km`
                    : "N/A"}
                </p>
                <p className="detail-label">Visibility</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🔵</span>
                <p className="detail-value">{weatherData.main.pressure} hPa</p>
                <p className="detail-label">Pressure</p>
              </div>
            </div>

            {/* clear current result and search again */}
            <button
              className="reset-btn"
              onClick={() => {
                setWeatherData(null);
                setCity("");
              }}
            >
              🔍 Search Another City
            </button>
          </div>
        )}

        {/* initial / empty state */}
        {!weatherData && !loading && !error && (
          <div className="default-state">
            <p className="default-emoji">🌏</p>
            <p>Search for a city to see its weather!</p>

            <div className="popular-cities">
              <p>Popular cities:</p>
              <div className="city-tags">
                {["Lahore", "Karachi", "London", "Dubai", "New York"].map(
                  (c) => (
                    <button
                      key={c}
                      className="city-tag"
                      onClick={() => setCity(c)}
                    >
                      {c}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;