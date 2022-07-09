let weatherElement = document.querySelector('.main');
let template = document.querySelector('#weatherTemplate').innerHTML;
let buttons = document.querySelector('.footer');
let appid = 'bf35cac91880cb98375230fb443a116f'
//let locationIds = [703448, 2643743, 5128638];
let locationIds = [703448, 707308, 4763793];

let units = localStorage.getItem('weatherUnits');
if (units) {
    if (units == 'imperial') {
        for (let button of buttons.children) {
            button.classList.toggle('inactive');
        }
    }
} else {
    units = getUnits()
}

renderWeather(locationIds, units, template);

setInterval(function(){
    renderWeather(locationIds, units, template);
}, 300000); // 5 minutes

buttons.addEventListener('click', function (e) {
    if (e.target.tagName == 'BUTTON' && e.target.classList.length == 2) {
        for (let button of buttons.children) {
            button.classList.toggle('inactive');
        }
        units = getUnits();
        renderWeather(locationIds, units, template);
        localStorage.setItem('weatherUnits', units);
    }
});


/**
 * Renders weather for selected locations.
 */
function renderWeather(locationIds, units, template) {
    let promises = [];

    //getting weather data
    for (const id of locationIds) {
        let url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=${units}&appid=${appid}`
        let promise = getWeatherData(url, units);
        promises.push(promise)
    };
    Promise.all(promises).then(data => {
        let html = '';
        let windDirections = [];
        
        //rendering html elements
        for (const weatherData of data) {
            html += Mustache.render(template, weatherData);
            windDirections.push(weatherData.windDeg);
        }
        weatherElement.innerHTML = html;

        //adding style for wind direction arrow
        let arrows = weatherElement.querySelectorAll('.fa-long-arrow-alt-up');
        for (let i = 0; i < arrows.length; i++) {
            arrows[i].style.transform = `rotate(${windDirections[i]}deg)`
        }

        //forecast details
        const detailsAll = document.querySelectorAll(".forecast-details");
        for (const details of detailsAll) {
            details.addEventListener("click", function (e) {
                let divForecast = details.querySelector('.forecast');
                if (details.hasAttribute("open")) {
                    divForecast.innerHTML = '';
                }
                else {
                    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?id=${divForecast.id}&units=${units}&appid=${appid}`;
                    let promise = getWeatherData(urlForecast, units);
                    promise.then(forecast => {
                        for (let weather of forecast) {
                        let divElement = document.createElement('div');
                        divElement.classList.add('forecast--section');
                        divElement.innerHTML = `<p>${weather.time}</p><p>${weather.temp}${weather.tempUnit}</p><img src="${weather.iconSrc}" alt="${weather.weatherDescription}" title="${weather.weatherDescription}" style="width:55%">`;
                        divForecast.append(divElement);
                        }
                    })
                }
            });
        }
    }).catch(error => console.error(error));
}

/**
 * Returns units in string format ('metric' or 'imperial').
 * @return {string} units value
 */
function getUnits() {
    for (let button of buttons.children) {
        if (button.classList.length == 1) {
            return button.className;
        }
    }
}

/**
 * Gets json object with weather data in specified units, converts it to the instance of WeatherData class and returns promise.
 * @return {object} promise, containing instance of WeatherData class
 */
function getWeatherData(url, units) {
    let promise = fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else if (response.status == 404){
                throw new Error(`Location ${response.statusText}`);
            }
            else {
                throw new Error(`Status code ${response.status}`);
            }
        })
        .then(json => {
            if (json.list) {
                let forecast = [];
                for (let index = 0; index < 8; index++) {
                    let forecastData = ForecastWeatherData.parseFromJson(json, units, index);
                    forecast.push(forecastData);
                }
                return forecast;
            } else {
                return CurrentWeatherData.parseFromJson(json, units);
            }
        })
        .catch(error => alert(error));
    
    return promise;
}