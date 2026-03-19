import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const API_KEY = "21f01244e87f500e9853ae07079dde89";

const WeatherDetails = () => {
  const { city } = useParams();
  const decodedCity = decodeURIComponent(city);

  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

  
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${decodedCity}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(result => {
        if (result.cod !== 200) {
          setError("City not found 😢");
          setData(null);
        } else {
          setData(result);
        }
      })
      .catch(() => setError("Something went wrong ⚠️"));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${decodedCity}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(result => {
        const daily = result.list?.filter(item =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(daily || []);
      });

  }, [decodedCity]);

  if (error) {
    return <div className="text-center mt-20 text-red-400 text-xl">{error}</div>;
  }

  if (!data) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-slate-800/50 p-8 rounded-3xl border border-blue-500/20 shadow-2xl text-center w-full max-w-md">

        <h2 className="text-3xl font-bold mb-2 uppercase text-blue-400">
          {data.name}
        </h2>

        <p className="text-6xl font-black mb-4">
          {Math.round(data.main.temp)}°C
        </p>

        <p className="text-gray-400 capitalize bg-slate-700/50 py-2 px-4 rounded-full inline-block">
          {data.weather[0].description}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700">
          <div>
            <p className="text-gray-500 text-xs">Humidity</p>
            <p className="font-bold">{data.main.humidity}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Wind</p>
            <p className="font-bold">{data.wind.speed} km/h</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg text-blue-400 mb-4">5-Day Forecast</h3>

          <div className="grid grid-cols-2 gap-3">
            {forecast.map((item, index) => (
              <div key={index} className="bg-slate-700/50 p-3 rounded-xl">
                <p className="text-sm">
                  {item.dt_txt.split(" ")[0]}
                </p>
                <p className="font-bold">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-gray-400">
                  {item.weather[0].main}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 text-blue-400 hover:underline"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

const MainSearch = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (city.length > 0) {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [city]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-6">

      <h1 className="text-6xl font-black text-blue-400 mb-6">
        SKY CAST
      </h1>

      <div className="w-full max-w-xl">

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && city) {
              navigate(`/weather/${encodeURIComponent(city)}`);
            }
          }}
          placeholder="Search city..."
          className="w-full p-5 rounded-2xl bg-slate-800 border border-blue-500 outline-none"
        />

        {suggestions.length > 0 && (
          <div className="bg-slate-800 mt-2 rounded-xl p-2">
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/weather/${encodeURIComponent(item.name)}`);
                }}
                className="p-2 hover:bg-slate-700 cursor-pointer rounded"
              >
                {item.name}, {item.country}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => city && navigate(`/weather/${encodeURIComponent(city)}`)}
          className="mt-4 w-full py-4 bg-blue-600 rounded-xl font-bold"
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSearch />} />
        <Route path="/weather/:city" element={<WeatherDetails />} />
      </Routes>
    </BrowserRouter>
  );
}