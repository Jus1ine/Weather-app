<?php

namespace Src;

class WeatherService {
    private $apiKey = 'f6cfb39a4a856ab05c4defb5f52847c3';
    private $apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    private $forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    public function getWeather($lat, $lon) {
        $url = sprintf('%s?lat=%s&lon=%s&units=metric&appid=%s', $this->apiUrl, $lat, $lon, $this->apiKey);
        return $this->fetchData($url);
    }

    public function getHourlyForecast($lat, $lon) {
        $url = sprintf('%s?lat=%s&lon=%s&units=metric&appid=%s', $this->forecastUrl, $lat, $lon, $this->apiKey);
        return $this->fetchData($url);
    }

    public function getWeatherByName($name) {
        $url = sprintf('%s?q=%s&appid=%s&units=metric', $this->apiUrl, urlencode($name), $this->apiKey);
        return $this->fetchData($url);
    }

    private function fetchData($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            return ['error' => curl_error($ch)];
        }
        curl_close($ch);
        return json_decode($result, true);
    }
}
