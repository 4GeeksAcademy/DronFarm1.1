import React from 'react';
import './WeatherForecast.css';
import 'weather-icons/css/weather-icons.css'; // Asegúrate de tener esto instalado vía npm

const iconMap = {
    '01d': 'wi-day-sunny',
    '01n': 'wi-night-partly-cloudy', // Este tiene luna y nubes, visualmente más atractivo
    '02d': 'wi-day-cloudy',
    '02n': 'wi-night-alt-cloudy',
    '03d': 'wi-cloud',
    '03n': 'wi-cloud',
    '04d': 'wi-cloudy',
    '04n': 'wi-cloudy',
    '09d': 'wi-showers',
    '09n': 'wi-showers',
    '10d': 'wi-day-rain',
    '10n': 'wi-night-alt-rain',
    '11d': 'wi-thunderstorm',
    '11n': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '13n': 'wi-snow',
    '50d': 'wi-fog',
    '50n': 'wi-fog',
};

const WeatherForecast = ({ daily, loading }) => {
    if (loading) return <p className="loading">Cargando clima...</p>;
    if (!daily || daily.length === 0) return <p>No hay datos disponibles</p>;

    return (
        <div className="weather-forecast-container">
            {daily.map((day, index) => {
                const fecha = new Date(day.dt * 1000);
                const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
                const iconCode = day.weather[0].icon;
                const iconClass = iconMap[iconCode] || 'wi-na';

                return (
                    <div
                        key={index}
                        className={`forecast-day ${index === 0 ? 'today-highlight' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <p className="day-name">{index === 0 ? 'Hoy' : nombreDia}</p>
                        <div className="weather-icon">
                            <i className={`wi ${iconClass}`} />
                        </div>
                        <p className="temp-range">
                            {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                        </p>
                        <p className="desc">{day.weather[0].description}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default WeatherForecast;
