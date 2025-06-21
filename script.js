const apiKey = "TOKEN";
const input = document.getElementById("input");
const button = document.getElementById("button");
const container = document.getElementById("container");
const currentWeather = document.getElementById("currentWeather");
const nextWeathers = document.getElementById("nextWeathers");
const today = new Date();
const weekDays = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

button.addEventListener("click", () => {
  currentWeather.innerHTML = "";
  getTodayWeather(input.value);
  getThreeDaysWeather(input.value);
});

function getThreeDaysWeather(input) {
  fetch(fiveDaysWeatherApiLink(input))
    .then((response) => {
      if (!response.ok) {
        nextWeathers.innerHTML = "";
      }

      return response.json();
    })
    .then((data) => {
      console.log(data);

      const wpisyPogody = [];
      data.list.forEach((e) => {
        const date = new Date(e.dt * 1000);
        const temp = (e.main.temp - 273.15).toFixed(2);
        const icon = e.weather[0].icon;
        wpisyPogody.push(
          new Pogoda(date.getDay(), date.getHours(), temp, icon)
        );
      });

      for (i = 1; i < 4; i++) {
        const nextDayWeathers = wpisyPogody.filter(
          (e) => e.day === NextXDay(today.getDay(), i)
        );
        nextWeathers.innerHTML += `
        <h3>${weekDays[NextXDay(today.getDay(), i)]}</h3>
        `;
        nextDayWeathers.forEach((e) => {
          nextWeathers.innerHTML += `
            <div id="weatherSample">
            <p>${e.hours}:00</p>
            <img src="${iconLink(e.icon)}">
            <p>${e.temp} °C</p>
            </div>
            `;
        });
      }
    });
}

function getTodayWeather(input) {
  fetch(currentWeatherApiLink(input))
    .then((response) => {
      if (!response.ok) {
        currentWeather.innerHTML = "<p>Podałeś złe miasto   </p>";
      }
      return response.json();
    })
    .then((data) => {
      const date = new Date(data.dt * 1000);
      const temp = (data.main.temp - 273.15).toFixed(2);
      const icon = data.weather[0].icon;
      currentWeather.innerHTML += `
      <h2>Aktualna pogoda w: ${input}</h2>
      <p>Temperatura: ${temp}</p>
      <img src="${iconLink(icon)}">
      `;
    });
}

function currentWeatherApiLink(city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
}

function fiveDaysWeatherApiLink(city) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
}

function iconLink(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

class Pogoda {
  constructor(day, hours, temp, icon) {
    this.day = day;
    this.hours = hours;
    this.temp = temp;
    this.icon = icon;
  }
}

function NextXDay(todayIndex, xDaysIndex) {
  if (todayIndex + xDaysIndex > 6) return todayIndex + xDaysIndex - 7;
  else return todayIndex + xDaysIndex;
}
