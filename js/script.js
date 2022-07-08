let weatherElement = document.querySelector('.main');
let template = document.querySelector('#weatherTemplate').innerHTML;
let buttons = document.querySelector('.footer');
//let locationIds = [703448, 2643743, 5128638];
let locationIds = [703448, 707308, 4763793];

//Setting units
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

//Reloads weather data every 2 minutes.
setInterval(function(){
    renderWeather(locationIds, units, template);
}, 120000);

//Changes units on button click
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
        let url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=${units}&appid=bf35cac91880cb98375230fb443a116f`
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
        
        //rendering forecast elements
        let forecastElements = document.querySelectorAll('.forecast');
        for (let forecastElement of forecastElements) {
            let forecast = get10DaysForecast(units);
            for (let weather of forecast) {
                let divElement = document.createElement('div');
                divElement.classList.add('forecast--section');
                divElement.innerHTML = `<p>${weather.date}</p><p>${weather.temp}</p>`;
                forecastElement.append(divElement);
            }
        }

        //forecast details fade in and out animation
        const detailsAll = document.querySelectorAll(".forecast-details");
        for (const details of detailsAll) {
            details.addEventListener("click", function(e) {
                if (details.hasAttribute("open")) { 
                    e.preventDefault(); // stop the default behavior - the hiding
                    details.classList.add("closing"); 
                    setTimeout(() => { 
                        details.removeAttribute("open"); // close the element
                        details.classList.remove("closing");
                    }, 100);
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
            return WeatherData.parseFromJson(json, units);
        })
        .catch(error => alert(error));
    
    return promise;
}

/**
 * Returns the date in 'index' days from today.
 * @return {string} date.month
 */
function getForecastDate(index) {
    let newDate = new Date();
        newDate.setDate(newDate.getDate() + index);
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        if (date < 10) {
            date = '0' + date;
        }
        
        return date + '.' + month
}

/**
 * Returns random temperature in certain units.
 * @return {string} temp
 */
function getForecastTemp(units) {
    let tempUnits;
    let max, min;
    switch (units) {
        case 'imperial':
            tempUnits = '\u2109';
            min = 60;
            max = 80;
            break;
        case 'metric':
            tempUnits = '\u2103';
            min = 20;
            max = 30;
            break;
    }
    let temp = Math.floor(Math.random() * (max - min + 1)) + min;
    return temp + tempUnits
}

/**
 * Returns array of objects that contain date and temperature.
 * @return {array} array of objects
 */
function get10DaysForecast(units) {
    let forecast = [];
    forecast.length = 10;
    for (let index = 1; index <= forecast.length; index++) {
        let weather = new Object();
        weather.date = getForecastDate(index);
        weather.temp = getForecastTemp(units);
        forecast[index-1] = weather;
    }
    return forecast;
}