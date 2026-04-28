package com.barbershop.modules.external.dto;

public class WeatherResponse {
    private double temperature;
    private int weatherCode;
    private String condition;
    private String message;
    private String icon;
    private double windSpeed;
    private int humidity;
    private String cityName;

    public WeatherResponse() {}

    public WeatherResponse(double temperature, int weatherCode, String condition,
                           String message, String icon, double windSpeed, int humidity, String cityName) {
        this.temperature = temperature;
        this.weatherCode = weatherCode;
        this.condition = condition;
        this.message = message;
        this.icon = icon;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.cityName = cityName;
    }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    public int getWeatherCode() { return weatherCode; }
    public void setWeatherCode(int weatherCode) { this.weatherCode = weatherCode; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    public int getHumidity() { return humidity; }
    public void setHumidity(int humidity) { this.humidity = humidity; }
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }
}
