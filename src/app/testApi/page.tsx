'use client';
// to use clientside js instead of server, because it is not static. 
// server only serves static, we use client for dynamic

import { useState } from 'react';

type WeatherData = {
  city: string;
  country: string;
  temperature: number;
  error?: string;
};

export default function TestApi() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
    //     ↑         ↑              ↑
    //   current   function to    initial
    //   value     update it      value
  const [city, setCity] = useState('London');

  const fetchWeather = async () => {
    // fetch a city param
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();
    setWeather(data);
  };

  return (
    <div>
      <h1>Weather Test</h1>
      
      {/* get city form*/}
      <input
        className="bg-white text-black"
        type="text"
        value={city}
        // on change, do this thing:
        //  const [city, setCity] = useState('London');
        // replacing city param with newly typed value
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      {/* since we already changed city, we jsut call fetchWeather,
      which is grabbing city param that we just updated */}
      <button onClick={fetchWeather}>Get Weather</button>
      
      {/* fetchWeather func should call setWeather, updating weather param, so it should appear */}
      {weather && !weather.error && (
        <div>
          <p>{weather.city}, {weather.country}: {weather.temperature}°C</p>
        </div>
      )}
      
      {weather?.error && (
        <p>Error: {weather.error}</p>
      )}
    </div>
  );
}