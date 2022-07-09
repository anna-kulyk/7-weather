/**
 * Containes information about the weather in certain location
 */
class WeatherData {
    location;
    unixDate;
    temp;
    weatherDescription;
    windSpeed;
    windDeg;
    pressure;
    iconSrc;
    units = 'metric';
    tempUnit;
    windUnit;
    pressureUnit = 'hPa';

    constructor(location, unixDate, temp, weatherDescription, windSpeed, windDeg, pressure, icon, units) {
        this.location = location;
        this.unixDate = unixDate;
        this.temp = Math.round(temp);
        this.weatherDescription = weatherDescription;
        this.windSpeed = Math.round(windSpeed);
        this.windDeg = windDeg;
        this.pressure = pressure;
        this.iconSrc = 'http://openweathermap.org/img/wn/' + icon +'@2x.png';
        this.units = (units == 'imperial') ? 'imperial' : 'metric';

        if (this.units == 'metric') {
            this.tempUnit = '\u2103';
            this.windUnit = 'm/s';
        }
        else if (this.units == 'imperial') {
            this.tempUnit = '\u2109';
            this.windUnit = 'mph';
        }
    }

    convertTime(unixTime, timezone) {
        let timezoneOffset = new Date().getTimezoneOffset() * 60;
        let date = new Date((unixTime + timezoneOffset + timezone) * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let time = hours + ":" + minutes.slice(-2);
        return time;
    }
}