import axios from "axios";

const API_KEY = "c2a629e373ecc6549dd0a9f021e7c86e"; // Replace if invalid

export const fetchWeather = async (city, unit) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  return response.data;
};

export const fetchWeatherByCoords = async (lat, lon, unit) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  );
  return response.data;
};

export const fetchWeatherForecast = async (city, unit) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  return response.data;
};