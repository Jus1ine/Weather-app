import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'f6cfb39a4a856ab05c4defb5f52847c3'; // Replace with your OpenWeatherMap API key
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) { }

  getWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`);
  }

  getHourlyForecast(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`);
  }

  getWeatherByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${name}&appid=${this.apiKey}&units=metric`);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private apiKey = 'f6cfb39a4a856ab05c4defb5f52847c3'; // Replace with your OpenWeatherMap API key
//   private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
//   private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

//   constructor(private http: HttpClient) {}

//   getWeather(lat: number, lon: number): Observable<any> {
//     const url = `${this.apiUrl}?units=metric&appid=${this.apiKey}`;
//     const body = { lat: lat, lon: lon };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.post(url, body, { headers });
//   }

//   getHourlyForecast(lat: number, lon: number): Observable<any> {
//     const url = `${this.forecastUrl}?units=metric&appid=${this.apiKey}`;
//     const body = { lat: lat, lon: lon };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.post(url, body, { headers });
//   }

//   getWeatherByName(name: string): Observable<any> {
//     const url = `${this.apiUrl}?units=metric&appid=${this.apiKey}`;
//     const body = { q: name };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.post(url, body, { headers });
//   }
// }
