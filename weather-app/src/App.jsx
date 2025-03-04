import { useState, useEffect } from "react";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi"; // Weather Icons

const API_KEY = "c2a629e373ecc6549dd0a9f021e7c86e"; // Replace with your actual API key

export default function App() {
  const [city, setCity] = useState("Bhubaneswar");
  const [weather, setWeather] = useState(null);
  const [bgImage, setBgImage] = useState("bg-gradient-to-r from-blue-500 to-indigo-600");

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
      updateBackground(response.data.weather[0].main);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchWeather(city);
    }
  };

  const updateBackground = (condition) => {
    const backgrounds = {
      Clear: "bg-gradient-to-r from-yellow-400 to-orange-500",
      Clouds: "bg-gradient-to-r from-gray-400 to-gray-700",
      Rain: "bg-gradient-to-r from-blue-600 to-gray-900",
      Snow: "bg-gradient-to-r from-blue-300 to-white",
      Thunderstorm: "bg-gradient-to-r from-gray-700 to-black",
      Default: "bg-gradient-to-r from-blue-500 to-indigo-600",
    };
    setBgImage(backgrounds[condition] || backgrounds.Default);
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: <WiDaySunny className="text-yellow-400 text-7xl" />,
      Clouds: <WiCloud className="text-gray-300 text-7xl" />,
      Rain: <WiRain className="text-blue-400 text-7xl" />,
      Snow: <WiSnow className="text-blue-200 text-7xl" />,
      Thunderstorm: <WiThunderstorm className="text-gray-600 text-7xl" />,
    };
    return icons[condition] || <WiDaySunny className="text-yellow-400 text-7xl" />;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgImage} text-white transition-all duration-500`}>
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white bg-opacity-20 backdrop-blur-md">
        {/* Search Input */}
        <input
          type="text"
          className="w-full p-3 rounded-md text-black outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleSearch}
        />

        {/* Weather Data */}
        {weather && (
          <div className="text-center mt-4">
            {getWeatherIcon(weather.weather[0].main)}
            <h1 className="text-4xl font-bold mt-2">{weather.name}</h1>
            <p className="text-lg capitalize">{weather.weather[0].description}</p>
            <h2 className="text-5xl font-bold mt-2">{weather.main.temp}°C</h2>
            <p className="text-sm mt-2">
              H: {weather.main.temp_max}°C | L: {weather.main.temp_min}°C
            </p>
            <p className="mt-2 text-sm">
              🌬 Wind: {weather.wind.speed} m/s | 💧 Humidity: {weather.main.humidity}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
