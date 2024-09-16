import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
   }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
   }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    return `${this.baseURL}weather?q=${this.cityName}&appid=${this.apiKey}`;
   }
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
   }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData() {
    const latLonQuery = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(latLonQuery);
    return this.destructureLocationData(locationData);
   }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { current } = response;
    const { dt, temp, humidity } = current;
    const { icon, description } = current.weather[0];
    const { speed } = current.wind;
    return new Weather(this.cityName, dt, icon, description, temp, speed, humidity);
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day: any) => {
      const { dt, temp, humidity } = day;
      const { icon, description } = day.weather[0];
      return new Weather(this.cityName, dt, icon, description, temp.day, currentWeather.windSpeed, humidity);
    });
    return forecastArray;
   }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.daily);
    return [currentWeather, ...forecast];
   }
}

export default new WeatherService();
