import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const WeatherDetails = () => {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const API_KEY = "21f01244e87f500e9853ae07079dde89";

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(result => setData(result));
  }, [city]);

  if (!data) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-slate-800/50 p-8 rounded-3xl border border-blue-500/20 shadow-2xl text-center w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-2 uppercase tracking-widest text-blue-400">{data.name}</h2>
        <p className="text-6xl font-black mb-4">{Math.round(data.main?.temp)}°C</p>
        <p className="text-gray-400 capitalize bg-slate-700/50 py-2 px-4 rounded-full inline-block">
          {data.weather?.[0].description}
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700">
          <div>
            <p className="text-gray-500 text-xs uppercase">Humidity</p>
            <p className="font-bold">{data.main?.humidity}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase">Wind</p>
            <p className="font-bold">{data.wind?.speed} km/h</p>
          </div>
        </div>
        <button onClick={() => window.history.back()} className="mt-8 text-blue-400 hover:underline text-sm">
          ← Back to Search
        </button>
      </div>
    </div>
  );
};

const MainSearch = () => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white w-full">
      <div className="text-center mb-12 w-full flex flex-col items-center">
        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-blue-400 mb-4 uppercase leading-none">
          SKY CAST
        </h1>
        <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto px-4">
          Instant. Accurate. Minimal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl mx-auto px-4 justify-center">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="w-full p-5 rounded-2xl bg-slate-800/50 border-2 border-blue-500/30 outline-none focus:border-blue-400 text-center sm:text-left text-lg"
        />
        <button
          onClick={() => city && navigate(`/weather/${city}`)}
          className="w-full sm:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-500/20 text-lg whitespace-nowrap"
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