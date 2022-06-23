"use strict"
let weatherBlock = document.querySelector('#weather');
let searchInput = document.querySelector('#search');

async function loadWeather() {
    searchInput.addEventListener('keyup', async (e) => {
        if (e.code === 'Enter') {
            const apiLink =
                `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=metric&cnt=6&appid=144c6751834d6d7e596a3271a8369621`
            const response = await fetch(apiLink, {
                method: 'GET',
            });
            const responseResult = await response.json();
            if (response.ok) {
                renderWeather(responseResult);
            } else {
                const errorMessage = responseResult.message;
                weatherBlock.innerHTML = `
                    <h1>${errorMessage}</h1>
                `;
            }
        }
    })
}

if (weatherBlock) {
    (async () => {
        await loadWeather();
    })();
}

function renderWeather(data) {
    const city = data.city.name;
    const temp = Math.round(data.list[0].main.temp);
    const feelsLike = Math.round(data.list[0].main.feels_like);
    const weatherStatus = data.list[0].weather[0].main;
    const weatherIcon = data.list[0].weather[0].icon;
    const daysArray = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    let template = `
        <div class="weather__header">
            <div class="weather__main">
                <div class="weather__temp">
                    ${temp}&#176C
                </div>
                <div class="weather__feels-like">
                    Feels like: ${feelsLike}&#176C
                </div>
            </div>
            <div class="weather__desc">
                <div class="weather__status">${weatherStatus}</div>
                <div class="weather__city">${city}</div>
            </div>
            <div class="weather__icon">
                <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
            </div>
        </div>
        <div class="weather__extra">`;

    for (let i = 1; i < data.list.length; i++) {
        const day = new Date(data.list[i].dt_txt);
        const templateExtraDay = `
        <div class="weather__extra-day">
            <div class="extra-day">${daysArray[day.getDay()] + ' ' + day.getHours() + ':' + day.getMinutes()}</div>
            <div class="extra-day__icon">
                <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="Weather icon">
            </div>
            <div class="extra-day__status">
                ${data.list[i].weather[0].description}
            </div>
            <div class="extra-day__temp">
                <div class="temp__day">${Math.round(data.list[i].main.temp_max)}&#176C</div>
                <div class="temp__night">${Math.round(data.list[i].main.temp_min)}&#176C</div>
            </div>
        </div>`;
        template += templateExtraDay;
    }
    weatherBlock.innerHTML = template + '</div>';
}

