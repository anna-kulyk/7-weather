/**
 * Containes information about the weather in current location: temperature, wind speed and degree, pressure, time of sunset and sunrise.  
 */
class WeatherData {
    #location;
    temp;
    weatherDescription;
    windSpeed;
    windDeg;
    pressure;
    sunrise;
    sunset;
    iconSrc;
    units = 'metric';
    tempUnit;
    windUnit;
    pressureUnit = 'hPa';

    constructor(location, temp, weatherDescription, windSpeed, windDeg, pressure, sunrise, sunset, icon, units) {
        this.#location = location;
        this.temp = Math.round(temp);
        this.weatherDescription = weatherDescription;
        this.windSpeed = Math.round(windSpeed);
        this.windDeg = windDeg;
        this.pressure = pressure;
        this.sunrise = this.#convertTime(sunrise, this.location.timezone);
        this.sunset = this.#convertTime(sunset, this.location.timezone);
        this.iconSrc = 'http://openweathermap.org/img/wn/' + icon +'@2x.png';
        this.units = (units == 'imperial') ? 'imperial' : 'metric';

        switch (this.units) {
            case 'imperial':
                this.tempUnit = '\u2109';
                this.windUnit = 'mph';
                break;
            case 'metric':
                this.tempUnit = '\u2103';
                this.windUnit = 'm/s';
                break;
        }
    }

    get location() {
        return this.#location;
    }

    /**
     * Converts json object into the instance of WeatherData class.
     * @return {object} WeatherData
     */
    static parseFromJson(jsonObj, units) {
        let location = new LocationData(jsonObj.name, jsonObj.coord, jsonObj.timezone);
        return new WeatherData(location, jsonObj.main.temp, jsonObj.weather[0].main, jsonObj.wind.speed, jsonObj.wind.deg, jsonObj.main.pressure, jsonObj.sys.sunrise, jsonObj.sys.sunset, jsonObj.weather[0].icon, units)
    }

    /**
     * Converts unix time into string time in hours and minutes.
     * @return {string} time
     */
    #convertTime(unixTime, timezone) {
        let timezoneOffset = new Date().getTimezoneOffset() * 60;
        let date = new Date((unixTime + timezoneOffset + timezone) * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let time = hours + ":" + minutes.slice(-2);
        return time;
    }
}
