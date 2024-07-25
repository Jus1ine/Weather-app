<?php

// Add CORS headers to handle cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include necessary files
require_once __DIR__ . '/../src/WeatherService.php';
require_once __DIR__ . '/WeatherController.php';

use Api\WeatherController;

// Create and handle the request
$controller = new WeatherController();
$controller->handleRequest();
