<?php

namespace Api;

use Src\WeatherService;

class WeatherController {
    private $weatherService;

    public function __construct() {
        $this->weatherService = new WeatherService();
    }

    public function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendResponse(['error' => 'Invalid request method. Only GET allowed.'], 405);
            return;
        }

        if (!isset($_GET['action'])) {
            $this->sendResponse(['error' => 'No action specified.'], 400);
            return;
        }

        switch ($_GET['action']) {
            case 'getWeather':
                $this->getWeather($_GET);
                break;
            case 'getHourlyForecast':
                $this->getHourlyForecast($_GET);
                break;
            case 'getWeatherByName':
                $this->getWeatherByName($_GET);
                break;
            default:
                $this->sendResponse(['error' => 'Invalid action.'], 400);
        }
    }

    private function getWeather($input) {
        if (isset($input['lat']) && isset($input['lon'])) {
            $data = $this->weatherService->getWeather($input['lat'], $input['lon']);
            $this->sendResponse($data);
        } else {
            $this->sendResponse(['error' => 'Latitude and longitude are required.'], 400);
        }
    }

    private function getHourlyForecast($input) {
        if (isset($input['lat']) && isset($input['lon'])) {
            $data = $this->weatherService->getHourlyForecast($input['lat'], $input['lon']);
            $this->sendResponse($data);
        } else {
            $this->sendResponse(['error' => 'Latitude and longitude are required.'], 400);
        }
    }

    private function getWeatherByName($input) {
        if (isset($input['name'])) {
            $data = $this->weatherService->getWeatherByName($input['name']);
            $this->sendResponse($data);
        } else {
            $this->sendResponse(['error' => 'City name is required.'], 400);
        }
    }

    private function sendResponse($data, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
