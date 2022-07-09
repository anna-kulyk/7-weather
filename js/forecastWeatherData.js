/**
 * Containes information about the forecast weather in certain location.  
 */
class ForecastWeatherData extends WeatherData {
    time;

    constructor(location, unixDate, temp, weatherDescription, windSpeed, windDeg, pressure, icon, units) {
        super(location, unixDate, temp, weatherDescription, windSpeed, windDeg, pressure, icon, units);
        this.time = super.convertTime(unixDate, this.location.timezone);
    }

    /**
     * Converts json object into the instance of ForecastWeatherData class.
     * @return {object} ForecastWeatherData
     */
    static parseFromJson(jsonObj, units, index) {
        let location = new LocationData(jsonObj.city.id, jsonObj.city.name, jsonObj.city.coord, jsonObj.city.timezone);
        return new ForecastWeatherData(location, jsonObj.list[index].dt, jsonObj.list[index].main.temp, jsonObj.list[index].weather[0].main, jsonObj.list[index].wind.speed, jsonObj.list[index].wind.deg, jsonObj.list[index].main.pressure, jsonObj.list[index].weather[0].icon, units)
    }
}
