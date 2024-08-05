import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiWeatherService } from '../service/api-weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  searchForm: FormGroup;
  weather: any;
  forecast: any;
  currentCity: string = '';
  currentState: string = '';
  selectedTemperatureUnit: string = 'celsius';

  constructor(private fb: FormBuilder, private weatherService: ApiWeatherService) {
    this.searchForm = this.fb.group({
      city: ['']
    });
  }

  ngOnInit() {
    this.showLocation();
  }

  searchWeather() {
    const city = this.searchForm.get('city')?.value.trim();
    if (city) {
      this.weatherService.getweather(city).subscribe(
        data => {
          console.log(data); // Log the full data response
          if (data && data.main) {
            this.weather = data;
            this.currentCity = data.name || city;
            this.currentState = data.state || '';
            this.fetch5DayForecast(city);
          } else {
            console.error('Invalid weather data', data);
          }
        },
        error => {
          console.error('Error fetching weather data', error);
        }
      );
    } else {
      console.error('City name cannot be empty');
    }
  }

  fetch5DayForecast(city: string) {
    this.weatherService.get5DayForecast(encodeURIComponent(city)).subscribe(
      data => {
        if (data && data.list) {
          this.forecast = this.filterForecastData(data.list);
        } else {
          console.error('Invalid forecast data', data);
        }
      },
      error => {
        console.error('Error fetching forecast data', error);
      }
    );
  }

  filterForecastData(data: any[]): any[] {
    const dailyForecast: any[] = [];
    const dateMap = new Set<string>();

    data.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dateMap.has(date)) {
        dateMap.add(date);
        entry.dayOfWeek = this.getDayOfWeek(date);
        dailyForecast.push(entry);
      }
    });

    return dailyForecast;
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getUTCDay()];
  }

  showLocation() {
    if (navigator.geolocation) {
      const geolocationOptions = {
        enableHighAccuracy: true, // Enable high accuracy
        timeout: 30000, // Increased timeout for better accuracy
        maximumAge: 0
      };

      const getLocation = (retryCount: number = 0) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Coordinates: ${lat}, ${lon}`); // Log coordinates for verification

            // If the location is not accurate (e.g., not within expected range), set fallback coordinates for Olongapo
            const olongapoLat = 14.8310;
            const olongapoLon = 120.3020;
            if (Math.abs(lat - olongapoLat) > 0.5 || Math.abs(lon - olongapoLon) > 0.5) {
              console.warn('Fallback to Olongapo coordinates');
              this.fetchWeatherByCoordinates(olongapoLat, olongapoLon);
            } else {
              this.fetchWeatherByCoordinates(lat, lon);
            }
          },
          (error) => {
            if (error.code === 3 && retryCount < 3) {
              console.warn('Geolocation timeout, retrying...');
              getLocation(retryCount + 1);
            } else {
              console.error('Geolocation error:', error);
              this.fetchDefaultLocationWeather(); // Fetch default location if geolocation fails
            }
          },
          geolocationOptions
        );
      };

      getLocation();
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.fetchDefaultLocationWeather(); // Fetch default location if geolocation is not supported
    }
  }

  fetchWeatherByCoordinates(lat: number, lon: number) {
    this.weatherService.getWeatherByCoordinates(lat, lon).subscribe(
      data => {
        console.log('Weather data:', data); // Log the full data response
        if (data && data.main) {
          this.weather = data;
          this.currentCity = data.name || 'Unknown';
          this.currentState = data.state || '';
          this.fetch5DayForecastByCoordinates(lat, lon);
        } else {
          console.error('Invalid weather data:', data);
          this.fetchDefaultLocationWeather();
        }
      },
      error => {
        console.error('Error fetching weather data by coordinates', error);
        this.fetchDefaultLocationWeather();
      }
    );
  }

  fetch5DayForecastByCoordinates(lat: number, lon: number) {
    this.weatherService.get5DayForecastByCoordinates(lat, lon).subscribe(
      data => {
        if (data && data.list) {
          this.forecast = this.filterForecastData(data.list);
        } else {
          console.error('Invalid forecast data:', data);
        }
      },
      error => {
        console.error('Error fetching forecast data', error);
      }
    );
  }

  fetchDefaultLocationWeather() {
    const defaultCity = 'Manila'; // Default city
    this.weatherService.getweather(defaultCity).subscribe(
      data => {
        if (data && data.main) {
          this.weather = data;
          this.currentCity = defaultCity;
          this.currentState = data.state || '';
          this.fetch5DayForecast(defaultCity);
        }
      },
      error => {
        console.error('Error fetching default location weather', error);
      }
    );
  }

  convertToFahrenheit(celsius: number): string {
    return ((celsius * 9 / 5) + 32).toFixed(1);
  }

  getWeatherIconUrl(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
