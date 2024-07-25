import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading = true;
  weatherData: any;
  hourlyForecast: any[] = [];
  weeklyForecast: any[] = [];
  uvIndex = 0;
  showError = false; // Add a flag for showing error message

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getWeatherData(14.5995, 120.9842); // Default location: Manila
  }

  askForLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log(`Latitude: ${lat}, Longitude: ${lon}`);
          this.getWeatherData(lat, lon);
        },
        (error) => {
          console.error('Error fetching location', error);
          alert('Error fetching location. Using default location: Manila.');
          this.getWeatherData(14.5995, 120.9842); // Coordinates for Manila
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser. Using default location: Manila.');
      this.getWeatherData(14.5995, 120.9842); // Coordinates for Manila
    }
  }

  getWeatherData(lat: number, lon: number) {
    console.log(`Fetching weather data for lat: ${lat}, lon: ${lon}`);
    this.weatherService.getWeather(lat, lon).subscribe(
      (data) => {
        this.weatherData = data;
        console.log('Weather data:', this.weatherData);
        this.loading = false;
        this.showError = false; // Hide error message if data is fetched successfully
        this.getHourlyForecast(lat, lon);
        this.getWeeklyForecast(lat, lon);
      },
      (error) => {
        console.error('Error fetching weather data', error);
        this.showError = true; // Show error message
        this.loading = false;
      }
    );
  }

  getHourlyForecast(lat: number, lon: number) {
    console.log(`Fetching hourly forecast for lat: ${lat}, lon: ${lon}`);
    this.weatherService.getHourlyForecast(lat, lon).subscribe(
      (data: any) => {
        this.hourlyForecast = data.list.slice(0, 8).map((item: any) => {
          return {
            time: new Date(item.dt * 1000).getHours() + ':00',
            icon: item.weather[0].icon,
            temp: item.main.temp
          };
        });
        console.log('Hourly forecast:', this.hourlyForecast);
      },
      (error) => {
        console.error('Error fetching hourly forecast data', error);
        alert('Error fetching hourly forecast data. Please try again later.');
      }
    );
  }

  getWeeklyForecast(lat: number, lon: number) {
    console.log(`Fetching weekly forecast for lat: ${lat}, lon: ${lon}`);
    this.weatherService.getHourlyForecast(lat, lon).subscribe(
      (data: any) => {
        const dailyData = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
        this.weeklyForecast = dailyData.slice(0, 7).map((item: any) => {
          return {
            day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            icon: item.weather[0].icon,
            temp: {
              max: item.main.temp_max,
              min: item.main.temp_min
            },
            weather: item.weather[0].description
          };
        });
        console.log('Weekly forecast:', this.weeklyForecast);
      },
      (error) => {
        console.error('Error fetching weekly forecast data', error);
        alert('Error fetching weekly forecast data. Please try again later.');
      }
    );
  }

  searchCity(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const city = inputElement.value.trim(); // Remove any extra whitespace

    if (city) {
      console.log(`Searching weather data for city: ${city}`);
      this.weatherService.getWeatherByName(city).subscribe(
        (data: any) => {
          // Check if the response contains valid coordinates
          if (data && data.coord) {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            console.log(`City found. Latitude: ${lat}, Longitude: ${lon}`);
            this.getWeatherData(lat, lon);
          } else {
            // If no valid coordinates are found
            console.error('City not found or invalid location.');
            this.showError = true; // Show error message
            alert('City not found. Please check the city name and try again.');
            this.loading = false;
          }
        },
        (error) => {
          console.error('Error fetching weather data for city', error);
          this.showError = true; // Show error message
          alert('Error fetching weather data for city. Please ensure the city name is correct.');
          this.loading = false;
        }
      );
    } else {
      alert('Please enter a city name.');
      this.loading = false;
    }
  }

  getWeatherIcon(icon: string): string {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getFormattedDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
