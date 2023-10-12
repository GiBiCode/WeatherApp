
const apiKey = "dcb66753beab8eeb43ed7f4376e3244e"; // Obtén una API Key de OpenWeatherMap


const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-result");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita que el formulario se envíe y recargue la página
  
  const ciudad = searchInput.value;
  if (ciudad) {
    await obtenerClima(ciudad);
  } else {
    alert("Por favor, ingrese una ciudad.");
  }
});

//Función clima:
async function obtenerClima(ciudad) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&lang=es`
    );
    const data = await response.json();

    if (response.ok) {
      const temperature = Math.round(data.main.temp - 273.15) + "ºC";
      
      const description = data.weather[0].description;
      const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
      const cityName = data.name;
      const country = data.sys.country;
      const feelsLike = Math.round(data.main.feels_like - 273.15) + "°C";
      const humidity = data.main.humidity;
      const visibility = (data.visibility / 1000).toFixed(1);
      const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
      searchResults.innerHTML = `
      <div class="weather-data">
      <p class="location"><i class="fas fa-map-marker"></i>${cityName}, ${country}</p>
      <p class="temperature"><img src="${iconUrl}" class="weather-icon">${temperature}</p> 
      <p class="description"> ${capitalizedDescription}</p>
        <div class="weather-details">
          <div class="weather-item">
            <p class="weather-title">Sensación térmica</p>
            <p class="weather-value">${feelsLike}</p>
          </div>
          <div class="weather-item">
            <p class="weather-title">Humedad</p>
            <p class="weather-value">${humidity}%</p>
          </div>
          <div class="weather-item">
            <p class="weather-title">Visibilidad</p>
            <p class="weather-value">${visibility} km</p>
          </div>
        </div>
          <div class="forecast">
            <div class="line"></div>
              <div id="weather-forecast"></div>
          </div>
      </div>`
      
      ;
    } else {
      searchResults.textContent = "Ciudad no encontrada.";
    }
  } catch (error) {
    console.error("Error:", error);
    searchResults.textContent = "Ocurrió un error al obtener el clima.";
  }

  // Después de obtener el clima actual, creamos la lógica para obtener los datos de los próximos días.
const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${apiKey}&lang=es`);
const forecastData = await forecastResponse.json();

// Obtener solo los pronósticos diarios
const daily = forecastData.list.filter(reading => reading.dt_txt.includes("18:00:00")); 

// Mostrarlos en el HTML
let forecastHTML = '<div class="forecast">';

daily.forEach(day => {
  // Parsear la fecha 
  const date = new Date(day.dt_txt);
  // Obtener día de la semana y día del mes
  const weekday = date.toLocaleDateString(undefined, {weekday: 'long'});
  const dayOfMonth = date.getDate();

// Formatear la fecha
  const formatted = `${weekday} ${dayOfMonth}`;
  const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

  forecastHTML += `
    <div class="daily">
      <img src="${icon}" class="wicon">
      <div class="day">${formatted}</div>  
      <div class="desc">${day.weather[0].description}</div>
      <div class="maxTemp">${Math.round(day.main.temp_max - 273.15)}°C</div>
    </div>
  `;
})
//incorporo en searchResults.innerHTML el div vacío y una vez obtengo el pronóstico, lo lleno con 
//con la información que contenga el DOM.
document.getElementById("weather-forecast").innerHTML = forecastHTML;
//console.log(forecastHTML)

//Agrego una línea dentro del div que separe los datos principales del próstico de los días.
const forecastElem = document.querySelector('.forecast');
forecastElem.classList.add('loaded');
}

