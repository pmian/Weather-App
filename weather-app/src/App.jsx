import { useState, useEffect } from "react";
import Header from "./components/Header";
import WeatherDisplay from "./components/WeatherDisplay";
import Footer from "./components/Footer";
import { auth } from "./firebase";
import { fetchWeather, fetchWeatherByCoords } from "./utils/api";

export default function App() {
  const [city, setCity] = useState("Bhubaneswar");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    fetchWeatherData(city);
    return () => unsubscribe();
  }, []);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city, unit);
      setWeather(data);
      setError(null);
      setCity(data.name);
    } catch (error) {
      setError("City not found or API error. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true);
          try {
            const data = await fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
              unit
            );
            setWeather(data);
            setError(null);
            setCity(data.name);
          } catch (error) {
            setError("Unable to fetch weather for your location.");
          } finally {
            setLoading(false);
          }
        },
        () => setError("Geolocation denied by user.")
      );
    } else {
      setError("Geolocation not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <Header
        city={city}
        setCity={setCity}
        fetchWeather={fetchWeatherData}
        user={user}
      />
      <WeatherDisplay
        weather={weather}
        loading={loading}
        error={error}
        unit={unit}
        setUnit={setUnit}
        fetchWeather={fetchWeatherData}
        handleGeolocation={handleGeolocation}
        city={city}
        user={user}
      />
      <Footer />
    </div>
  );
}