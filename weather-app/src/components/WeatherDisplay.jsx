import { useState, useEffect } from "react";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import { fetchWeatherForecast } from "../utils/api";

export default function WeatherDisplay({
    weather,
    loading,
    error,
    unit,
    setUnit,
    fetchWeather,
    handleGeolocation,
    city,
    user,
}) {
    const [forecast, setForecast] = useState(null);
    const [savedCities, setSavedCities] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        console.log("WeatherDisplay useEffect - User:", user);
        console.log("Current savedCities before update:", savedCities);

        if (weather) {
            fetchForecastData();
        }
        if (user) {
            // Load saved cities from localStorage when logged in
            const storedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
            setSavedCities(storedCities);
            console.log("Loaded saved cities from localStorage:", storedCities);
        } else {
            // Clear saved cities from state when logged out
            console.log("User logged out, clearing saved cities from state");
            setSavedCities([]);
        }
    }, [weather, user]);

    const fetchForecastData = async () => {
        try {
            const data = await fetchWeatherForecast(city, unit);
            const daily = data.list
                .filter((item) => item.dt_txt.includes("12:00:00"))
                .slice(0, 5);
            setForecast(daily);
        } catch (error) {
            console.error("Error fetching forecast:", error);
        }
    };

    const saveCitiesToLocalStorage = (updatedCities) => {
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));
        console.log("Saved cities to localStorage:", updatedCities);
    };

    const getWeatherIcon = (condition) => {
        const icons = {
            Clear: <WiDaySunny className="text-yellow-400 text-6xl" />,
            Clouds: <WiCloud className="text-gray-300 text-6xl" />,
            Rain: <WiRain className="text-blue-400 text-6xl" />,
            Snow: <WiSnow className="text-blue-200 text-6xl" />,
            Thunderstorm: <WiThunderstorm className="text-gray-600 text-6xl" />,
        };
        return icons[condition] || <WiDaySunny className="text-yellow-400 text-6xl" />;
    };

    const toggleUnit = () => {
        const newUnit = unit === "metric" ? "imperial" : "metric";
        setUnit(newUnit);
        fetchWeather(city);
        fetchForecastData();
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const handleSaveCity = () => {
        if (!savedCities.includes(city) && weather && user) {
            const updatedCities = [...savedCities, city];
            setSavedCities(updatedCities);
            saveCitiesToLocalStorage(updatedCities);
        }
    };

    const handleRemoveCity = (cityToRemove) => {
        const updatedCities = savedCities.filter((c) => c !== cityToRemove);
        setSavedCities(updatedCities);
        saveCitiesToLocalStorage(updatedCities);
    };

    const handleLoadCity = (savedCity) => {
        fetchWeather(savedCity);
    };

    const getWindDirection = (deg) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    };

    return (
        <main className="flex-grow flex items-center justify-center py-10">
            <div className="w-full max-w-5xl bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                {loading && (
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent"></div>
                        <p className="mt-2 text-lg">Loading weather...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center">
                        <p className="text-red-300 text-lg">{error}</p>
                        <button
                            onClick={() => fetchWeather(city)}
                            className="mt-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
                {weather && !loading && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold">{weather.name}</h1>
                                <p className="text-lg text-gray-200 capitalize">
                                    {weather.weather[0].description}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {getWeatherIcon(weather.weather[0].main)}
                                {user && (
                                    <button
                                        onClick={handleSaveCity}
                                        className="px-3 py-1 bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors text-sm"
                                        disabled={savedCities.includes(city)}
                                    >
                                        {savedCities.includes(city) ? "Saved" : "Save City"}
                                    </button>
                                )}
                            </div>
                        </div>
                        {user && (
                            <div className="mb-6">
                                {savedCities.length > 0 ? (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Saved Cities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {savedCities.map((savedCity) => (
                                                <div
                                                    key={savedCity}
                                                    className="flex items-center bg-gray-700 bg-opacity-50 rounded-md p-2"
                                                >
                                                    <button
                                                        onClick={() => handleLoadCity(savedCity)}
                                                        className="text-sm text-white hover:underline"
                                                    >
                                                        {savedCity}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveCity(savedCity)}
                                                        className="ml-2 text-red-400 hover:text-red-500"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-300">
                                        No saved cities yet. Save a city to see it here!
                                    </p>
                                )}
                            </div>
                        )}
                        {!user && (
                            <p className="mb-6 text-sm text-gray-300">
                                Log in with Google to save and manage your favorite cities.
                            </p>
                        )}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Temperature</p>
                                <p className="text-4xl font-semibold">
                                    {weather.main.temp}°{unit === "metric" ? "C" : "F"}
                                </p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Feels Like</p>
                                <p className="text-4xl font-semibold">
                                    {weather.main.feels_like}°{unit === "metric" ? "C" : "F"}
                                </p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">High / Low</p>
                                <p className="text-xl">
                                    {weather.main.temp_max}° / {weather.main.temp_min}°
                                    {unit === "metric" ? "C" : "F"}
                                </p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Humidity</p>
                                <p className="text-xl">{weather.main.humidity}%</p>
                            </div>
                            {showDetails && (
                                <>
                                    <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                        <p className="text-sm text-gray-300">Wind Direction</p>
                                        <p className="text-xl">
                                            {getWindDirection(weather.wind.deg)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                        <p className="text-sm text-gray-300">Cloudiness</p>
                                        <p className="text-xl">{weather.clouds.all}%</p>
                                    </div>
                                </>
                            )}
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Wind Speed</p>
                                <p className="text-xl">
                                    {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
                                </p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Pressure</p>
                                <p className="text-xl">{weather.main.pressure} hPa</p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Visibility</p>
                                <p className="text-xl">
                                    {(weather.visibility / 1000).toFixed(1)} km
                                </p>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">Sunrise / Sunset</p>
                                <p className="text-xl">
                                    {formatTime(weather.sys.sunrise)} /{" "}
                                    {formatTime(weather.sys.sunset)}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                onClick={toggleUnit}
                                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Switch to {unit === "metric" ? "°F" : "°C"}
                            </button>
                            <button
                                onClick={handleGeolocation}
                                className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Use My Location
                            </button>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                {showDetails ? "Hide Details" : "More Details"}
                            </button>
                        </div>
                        {forecast && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">5-Day Forecast</h3>
                                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                    {forecast.map((day) => (
                                        <div
                                            key={day.dt}
                                            className="flex-shrink-0 w-36 bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-30 p-4 rounded-lg text-center hover:bg-opacity-50 transition-all shadow-md"
                                        >
                                            <p className="text-sm font-medium">
                                                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </p>
                                            {getWeatherIcon(day.weather[0].main)}
                                            <p className="text-lg font-medium">
                                                {day.main.temp}°{unit === "metric" ? "C" : "F"}
                                            </p>
                                            <p className="text-sm text-gray-300 capitalize">
                                                {day.weather[0].description}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                H: {day.main.temp_max}° / L: {day.main.temp_min}°
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}