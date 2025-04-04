import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherWidget = ({ fields }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!Array.isArray(fields) || fields.length === 0) return;
    
        const fieldWithCoords = fields.find(f => f.coordinates);
        if (!fieldWithCoords) return;
    
        const [lat, lon] = fieldWithCoords.coordinates.split(',').map(coord => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lon)) return;
    
        const fetchWeather = async () => {
            try {
                const apiKey = 'e3007f5e69ba980e3897f92c2c2d4750';
    
                const currentRes = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`
                );
    
                const forecastRes = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`
                );
    
                setWeatherData(currentRes.data);
    
                const dailyForecast = forecastRes.data.list.filter(item =>
                    item.dt_txt.includes('12:00:00')
                ).slice(0, 3);
    
                setForecastData(dailyForecast);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError("Could not load weather data");
            }
        };
    
        fetchWeather();
    }, [fields]);
    

    if (error) return <div className="p-4 border rounded text-red-600">{error}</div>;
    if (!weatherData) return <div className="p-4 border rounded">Loading weather data...</div>;

    return (
        <div className="p-4 bg-white rounded shadow border">
            <h3 className="text-lg font-bold mb-2">Weather at your field</h3>

            <div className="mb-4">
                <p className="text-xl">{weatherData.name}</p>
                <p className="text-3xl font-semibold">{weatherData.main.temp}°C</p>
                <p className="capitalize">{weatherData.weather[0].description}</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2">Next days</h4>
                <div className="flex gap-4">
                    {forecastData.map((day, i) => (
                        <div key={i} className="text-center bg-gray-50 rounded p-2 shadow-sm">
                            <p className="text-sm font-medium">{new Date(day.dt_txt).toLocaleDateString('en-GB', { weekday: 'short' })}</p>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                alt="icon"
                                className="mx-auto h-12"
                            />
                            <p>{Math.round(day.main.temp)}°C</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
