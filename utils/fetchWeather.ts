import axios from 'axios';

const API_KEY = 'a60767d7d6cfa3ac08e744985021fb1f';

const fetchWeather = async (
  lat?: number,
  lon?: number,
  city?: string
) => {
  let url = '';

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  } else if (lat !== undefined && lon !== undefined) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  } else {
    throw new Error('No location or city provided');
  }

  const response = await axios.get(url);
  return response.data;
};

export default fetchWeather;
