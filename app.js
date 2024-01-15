const gap = 273.15;
const searchBtn = document.querySelector('#searchBtn');
const date = document.querySelector('#date')
const currWeatherImg = document.querySelector('.weatherType img');
const weatherType = document.querySelector('.weatherType p');
const temp = document.querySelector('.tempDegrees');
const tempRealFeel = document.querySelector('.tempRealFeel');
const humidity = document.querySelector('#humidityInfo');
const wind = document.querySelector('#windInfo');
const pressure = document.querySelector('#pressureInfo');
const tableBody = document.querySelector('#weatherTable tbody');
const neighborsForecast = document.querySelector('.neighborForecastSection');
const hourRow = document.querySelector('#hourRow');
const iconRow = document.querySelector('#iconRow');
const forecastRow = document.querySelector('#forecastRow');
const tempRow = document.querySelector('#tempRow');
const realFeelRow = document.querySelector('#realFeelRow');
const windRow = document.querySelector('#windRow');
const todayForecastBtn = document.querySelector('#todayForecast');
const fiveDayForecastBtn = document.querySelector('#fiveDayForecast');
const forecastSection = document.querySelector('.currWeatherInfo');
const city = document.getElementById('cityInput');
let cityValue;
let certainDayForecast;
var presentDate = new Date();
const presentDay = (presentDate.getDate() <= 9 ? '0' : '') + presentDate.getDate();
const presentMonth = ((presentDate.getMonth() + 1) <= 9 ? '0' : '') + (presentDate.getMonth() + 1);

defaultForecast();
function defaultForecast() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            currentCityLat = position.coords.latitude;
            currentCityLon = position.coords.longitude;
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${currentCityLat}&lon=${currentCityLon}&appid=8ce29ba35de34247ca262c0969688068`;
            fetch(api)
                .then(res => res.json())
                .then(data => {
                    cityValue = data.name;
                    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=8ce29ba35de34247ca262c0969688068`;
                    fetch(api)
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            date.innerHTML = presentDay + '.' + presentMonth + '.' + presentDate.getFullYear();
                            city.value = data.city.name + ', ' + data.city.country;
                            setCurrWeatherInfo(data);
                            setHourlyForecast(data, presentDate.getFullYear(), presentMonth, presentDay);
                            setWeatherInNearbyCities(data.city.coord.lat, data.city.coord.lon, data.city.name);
                        })
                        .catch(error => console.error('Error: ', error));
                })
                .catch(error => console.error('Error: ', error));
        });
    } else {
        console.log('Error: geolocation');
    }
}

city.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        searchBtn.click();
    }
})

searchBtn.onclick = () => {
    cityValue = city.value;
    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=8ce29ba35de34247ca262c0969688068`;
    fetch(api)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            date.innerHTML = presentDay + '.' + presentMonth + '.' + presentDate.getFullYear();
            city.value = data.city.name + ', ' + data.city.country;
            setCurrWeatherInfo(data);
            setHourlyForecast(data, presentDate.getFullYear(), presentMonth, presentDay);
            setWeatherInNearbyCities(data.city.coord.lat, data.city.coord.lon, data.city.name);
        })
        .catch(error => console.error('Error: ', error));
}


function setHourlyForecast(data, year, month, day) {
    hourRow.innerHTML = `<td class="rowHeader">TODAY</td>`;
    iconRow.innerHTML = `<td></td>`;
    forecastRow.innerHTML = `<td class="rowHeader">Forecast</td>`;
    tempRow.innerHTML = `<td class="rowHeader">Temp (&deg;C)</td>`;
    realFeelRow.innerHTML = `<td class="rowHeader">Real Feel</td>`;
    windRow.innerHTML = `<td class="rowHeader">Wind (m/s)</td>`;

    const dateToCheck = `${year}-${month}-${day}`;
    const weatherData = data.list.filter(x => x.dt_txt.includes(dateToCheck));
    weatherData.forEach(x => {
        hourRow.innerHTML += `<td class='tableCell'>${x.dt_txt.toString().substring(11, 16)}</td>`
        var iconURL = `https://openweathermap.org/img/wn/${x.weather[0].icon}.png`
        iconRow.innerHTML += `<td class='tableCell'><img src=${iconURL}></td>`;
        forecastRow.innerHTML += `<td class='tableCell'>${x.weather[0].main}</td>`;
        tempRow.innerHTML += `<td class='tableCell'>${Math.floor(x.main.temp - gap)}</td>`;
        realFeelRow.innerHTML += `<td class='tableCell'>${Math.floor(x.main.feels_like - gap)}</td>`;
        windRow.innerHTML += `<td class='tableCell'>${x.wind.speed}</td>`;
    });
}

todayForecastBtn.onclick = () => {
    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=8ce29ba35de34247ca262c0969688068`;
    fetch(api)
        .then(res => res.json())
        .then(data => {
            setCurrWeatherInfo(data);
            setHourlyForecast(data, presentDate.getFullYear(), presentMonth, presentDay);
        })
        .catch(error => console.error('Error: ', error));
}

function setCurrWeatherInfo(data) {
    forecastSection.innerHTML = `
    <div class="weatherType">
    <img>
    <p></p>
    </div>
    <div>
        <p class="tempDegrees"></p>
        <p class="tempRealFeel"></p>
    </div>
    <div class="weatherDetails">
        <div>
            <p>Humidity: </p>
            <p id="humidityInfo"></p>
        </div>
        <div>
            <p>Wind: </p>
            <p id="windInfo"></p>
        </div>
        <div>
            <p>Pressure: </p>
            <p id="pressureInfo"></p>
        </div>
    </div>`;

    var temp = document.querySelector('.tempDegrees');
    var tempRealFeel = document.querySelector('.tempRealFeel');
    var currWeatherImg = document.querySelector('.weatherType img');
    var weatherType = document.querySelector('.weatherType p');
    var humidity = document.querySelector('#humidityInfo');
    var wind = document.querySelector('#windInfo');
    var pressure = document.querySelector('#pressureInfo');

    temp.innerHTML = Math.floor(data.list[0].main.temp - gap) + '&deg;';
    tempRealFeel.innerHTML = 'Real Feel ' + Math.floor(data.list[0].main.feels_like - gap) + '&deg;';
    currWeatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`);
    weatherType.innerHTML = data.list[0].weather[0].main;
    humidity.innerHTML = data.list[0].main.humidity + '%';
    wind.innerHTML = data.list[0].wind.speed + ' m/s';
    pressure.innerHTML = data.list[0].main.pressure + ' hPa';
}

fiveDayForecastBtn.onclick = () => {
    forecastSection.innerHTML = ``;
    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=8ce29ba35de34247ca262c0969688068`;
    fetch(api)
        .then(res => res.json())
        .then(data => {
            set5dayForecast(data);
        })
        .catch(error => console.error('Error: ', error));
}

function set5dayForecast(data) {
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i = 0; i < 5; i++) {
        let currDate = new Date(presentDate);
        currDate.setDate(currDate.getDate() + i);
        let dayToCheck = (currDate.getDate() <= 9 ? '0' : '') + currDate.getDate();
        let monthToCheck = ((currDate.getMonth() + 1) <= 9 ? '0' : '') + (currDate.getMonth() + 1);
        const dateToCheck = `${currDate.getFullYear()}-${monthToCheck}-${dayToCheck}`;
        const forecastByDay = data.list.filter(x => x.dt_txt.includes(dateToCheck));
        if(i==0){
            forecastSection.innerHTML += `
            <div class='certainDayForecast selected'>
                <h2>${daysOfWeek[currDate.getDay()]}</h2>
                <p>${months[currDate.getMonth()]} ${currDate.getDate()}</p>
                <img src=${`https://openweathermap.org/img/wn/${forecastByDay[0].weather[0].icon}.png`}>
                <h1>${Math.floor(forecastByDay[0].main.temp - gap)}&deg;C</h1>
                <p>${forecastByDay[0].weather[0].main}</p>
            </div>
            `;
        }else{
            forecastSection.innerHTML += `
            <div class='certainDayForecast'>
                <h2>${daysOfWeek[currDate.getDay()]}</h2>
                <p>${months[currDate.getMonth()]} ${currDate.getDate()}</p>
                <img src=${`https://openweathermap.org/img/wn/${forecastByDay[0].weather[0].icon}.png`}>
                <h1>${Math.floor(forecastByDay[0].main.temp - gap)}&deg;C</h1>
                <p>${forecastByDay[0].weather[0].main}</p>
            </div>
            `;
        }
    }
    certainDayForecast = document.querySelectorAll('.certainDayForecast');
    certainDayForecast.forEach(day => {
        day.onclick = () => {
            certainDayForecast.forEach(otherDay => {
                otherDay.classList.remove('selected');
            });
            day.classList.add('selected');
            let year = presentDate.getFullYear();
            let dateText = day.querySelector('p').textContent;
            let [monthText, dayText] = dateText.split(' ');
            let month = months.indexOf(monthText) + 1;
            const api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=8ce29ba35de34247ca262c0969688068`;
            fetch(api)
                .then(res => res.json())
                .then(data => {
                    setHourlyForecast(data, year, month.toString().padStart(2, '0'), dayText.padStart(2, '0'));
                })
                .catch(error => console.error('Error: ', error));
        }
    })
}

function setWeatherInNearbyCities(lat, lon, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=8ce29ba35de34247ca262c0969688068`)
        .then(response => response.json())
        .then(data => {
            neighborsForecast.innerHTML=``;
            for (let i = 1; i <= 4; i++) {
                if (cityName != data.list[i].name) {
                    let icon = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
                    neighborsForecast.innerHTML += `
                    <div>
                        <p>${data.list[i].name}</p>
                        <img src=${icon}>
                        <p>${Math.floor(data.list[i].main.temp - gap) + '&deg;C'}</p>
                    </div>
                    `;
                }
            }
        })
        .catch(error => console.error('Error', error));
}
