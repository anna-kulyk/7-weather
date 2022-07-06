class Forecast {
    #location;
    data = [];
    units;

    constructor(location, forecast, units) {
        this.#location = location;
        this.units = units;
        this.data = forecast;
    }

    get location() {
        return this.#location;
    }

    // static parseFromJson(jsonObj, units) {
    //     let location = new LocationData(jsonObj.city.name, jsonObj.city.coord, jsonObj.city.timezone);
    //     let forecast = [];
    //     for (let )
    //     return new Forecast(location, forecast, units)
    // }

    #getForecastListFromJsonObj(jsonObj, timezone) {
        let forecastTime = 15;
        let forecast = [];
        let today = new Date();
        let offset = timezone / 3600;
        let start = today.getHours() - offset;
        while (start % 3 != 0) {
            start++;
        }
        if (start > 24) {
            start -= 24;
        }
        




        let date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(14, 0, 0);
        let unixt = Math.floor(date.getTime() / 1000);
        console.log(date);
        console.log(unixt);



    }


}