/**
 * Containes information about the current weather in certain location.  
 */
class CurrentWeatherData extends WeatherData {
    sunrise;
    sunset;

    constructor(location, unixDate, temp, weatherDescription, windSpeed, windDeg, pressure, icon, units, sunrise, sunset) {
        super(location, unixDate, temp, weatherDescription, windSpeed, windDeg, pressure, icon, units);
        this.sunrise = super.convertTime(sunrise, this.location.timezone);
        this.sunset = super.convertTime(sunset, this.location.timezone);
    }

    /**
     * Converts json object into the instance of CurrentWeatherData class.
     * @return {object} CurrentWeatherData
     */
    static parseFromJson(jsonObj, units) {
        let location = new LocationData(jsonObj.id, jsonObj.name, jsonObj.coord, jsonObj.timezone);
        return new CurrentWeatherData(location, jsonObj.dt, jsonObj.main.temp, jsonObj.weather[0].main, jsonObj.wind.speed, jsonObj.wind.deg, jsonObj.main.pressure, jsonObj.weather[0].icon, units, jsonObj.sys.sunrise, jsonObj.sys.sunset)
    }
}
