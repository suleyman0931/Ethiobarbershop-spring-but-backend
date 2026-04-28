package com.barbershop.modules.external.service;

import com.barbershop.modules.external.dto.WeatherResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * WeatherService — integrates with Open-Meteo API (100% free, no API key required)
 * Docs: https://open-meteo.com/en/docs
 *
 * Fetches current weather for Addis Ababa, Ethiopia
 * Coordinates: lat=9.0054, lon=38.7636
 */
@Service
public class WeatherService {

    private static final String API_URL =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=9.0054&longitude=38.7636" +
        "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&timezone=Africa%2FAddis_Ababa";

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherResponse getCurrentWeather() {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(API_URL, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Map<String, Object> current = (Map<String, Object>) body.get("current");

                double temperature = ((Number) current.get("temperature_2m")).doubleValue();
                int weatherCode  = ((Number) current.get("weather_code")).intValue();
                double windSpeed = ((Number) current.get("wind_speed_10m")).doubleValue();
                int humidity     = ((Number) current.get("relative_humidity_2m")).intValue();

                String condition = getCondition(weatherCode);
                String icon      = getIcon(weatherCode);
                String message   = getBarberMessage(weatherCode, temperature);

                return new WeatherResponse(temperature, weatherCode, condition, message, icon, windSpeed, humidity, "Addis Ababa");
            }
        } catch (Exception e) {
            System.err.println("Weather API error: " + e.getMessage());
        }

        // Fallback
        return new WeatherResponse(25.0, 0, "Clear", "Perfect day for a fresh cut!", "☀️", 10.0, 50, "Addis Ababa");
    }

    // WMO Weather Interpretation Codes → human-readable condition
    private String getCondition(int code) {
        if (code == 0)              return "Clear Sky";
        if (code <= 2)              return "Partly Cloudy";
        if (code == 3)              return "Overcast";
        if (code <= 49)             return "Foggy";
        if (code <= 59)             return "Drizzle";
        if (code <= 69)             return "Rainy";
        if (code <= 79)             return "Snowy";
        if (code <= 82)             return "Rain Showers";
        if (code <= 86)             return "Snow Showers";
        if (code <= 99)             return "Thunderstorm";
        return "Unknown";
    }

    private String getIcon(int code) {
        if (code == 0)              return "☀️";
        if (code <= 2)              return "⛅";
        if (code == 3)              return "☁️";
        if (code <= 49)             return "🌫️";
        if (code <= 67)             return "🌧️";
        if (code <= 77)             return "❄️";
        if (code <= 82)             return "🌦️";
        if (code <= 99)             return "⛈️";
        return "🌡️";
    }

    // Barbershop-relevant message based on weather
    private String getBarberMessage(int code, double temp) {
        if (code == 0 && temp >= 20) return "Perfect day for a fresh cut! ✂️";
        if (code <= 2)               return "Great weather to step out and get groomed! 💈";
        if (code == 3)               return "Cloudy but still a good day for a haircut! 💈";
        if (code <= 49)              return "Foggy outside — stay sharp with a fresh style! ✂️";
        if (code <= 67)              return "Rainy day? Perfect time to book an appointment! 📅";
        if (code <= 99)              return "Stay indoors and book your next appointment online! 📱";
        return "Come in for a fresh look today! 💈";
    }
}
