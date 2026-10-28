import axios from 'axios';

export const fetchWeatherByCoords = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    
    const current = response.data.current_weather;
    const daily = response.data.daily;

    const forecast = [];
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        forecast.push({
          date: daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
          weatherCode: daily.weathercode[i],
        });
      }
    }

    return {
      temp: current ? Math.round(current.temperature) : 22,
      windSpeed: current ? Math.round(current.windspeed) : 12,
      weatherCode: current ? current.weathercode : 0,
      forecast,
    };
  } catch (error) {
    console.warn('Weather fetch error, returning fallback metrics:', error);
    return {
      temp: 24,
      windSpeed: 10,
      weatherCode: 0,
      forecast: [
        { date: 'Day 1', maxTemp: 25, minTemp: 18, weatherCode: 0 },
        { date: 'Day 2', maxTemp: 26, minTemp: 19, weatherCode: 1 },
        { date: 'Day 3', maxTemp: 23, minTemp: 17, weatherCode: 3 },
        { date: 'Day 4', maxTemp: 22, minTemp: 16, weatherCode: 61 },
        { date: 'Day 5', maxTemp: 24, minTemp: 18, weatherCode: 0 },
      ],
    };
  }
};

export const getWeatherDescription = (code) => {
  if (code === 0) return { label: 'Sunny / Clear', icon: 'Sun' };
  if (code <= 3) return { label: 'Partly Cloudy', icon: 'CloudSun' };
  if (code <= 48) return { label: 'Foggy', icon: 'CloudFog' };
  if (code <= 67) return { label: 'Light Rain', icon: 'CloudRain' };
  if (code <= 77) return { label: 'Snowy', icon: 'Snowflake' };
  if (code <= 82) return { label: 'Showers', icon: 'CloudDrizzle' };
  return { label: 'Thunderstorm', icon: 'CloudLightning' };
};
