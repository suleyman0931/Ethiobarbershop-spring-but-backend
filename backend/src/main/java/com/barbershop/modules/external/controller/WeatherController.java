package com.barbershop.modules.external.controller;

import com.barbershop.modules.external.dto.WeatherResponse;
import com.barbershop.modules.external.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/external")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    /**
     * GET /api/external/weather
     * Returns current weather for Addis Ababa — public endpoint, no auth required.
     * Uses Open-Meteo API (free, no API key needed).
     */
    @GetMapping("/weather")
    public ResponseEntity<WeatherResponse> getCurrentWeather() {
        return ResponseEntity.ok(weatherService.getCurrentWeather());
    }
}
