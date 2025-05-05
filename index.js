const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
const title = document.querySelector('.title');

// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];

// Funcion que pide todos los paises
const getCountriesFromAPI = async () => {
  try {
    const url =  `https://restcountries.com/v3.1/all`;
    const response = await fetch(url);
    const country = await response.json();
    countries = country;
      if (!response.ok) throw new Error(country.message);
  } catch (error) {
    if (error.message) {
        alert('No se pudieron cargar los países! Intenta nuevamente más tarde.')
        container.innerHTML = `
        <div class="error-div">
        <span class="material-symbols-outlined" id="error-icon">error</span>
        <p class="error-text">Intenta nuevamente más tarde.</p>
        </div>`;
    }
  }
}

// Funcion que pide el clima segun la capital
const getWeatherFromAPI = async (capital) => {
  try {
    const url =  `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=4ae339f1eefc34d58085b14a97ce190c&units=metric`;
    const response = await fetch(url);
    const weatherCountry = await response.json();
      if (!response.ok) throw new Error(weatherCountry.message);
      return weatherCountry;
  } catch (error) {
    if (error.message) {
      alert('No se pudo cargar el clima! Intenta nuevamente más tarde.')
      container.innerHTML = `
      <div class="error-div">
      <span class="material-symbols-outlined" id="error-icon">error</span>
      <p class="error-text">Intenta nuevamente más tarde.</p>
      </div>`
    }
  }
}

// Funcion que muestra el clima (descriptcion, grados celcius e icono) de la capital
const showWeatherCountry = async (capital) => {
  const weatherData = await getWeatherFromAPI(capital);
  if (!weatherData) {
    container.innerHTML = `
    <div class="error-div">
      <span class="material-symbols-outlined" id="error-icon">error</span>
      <p class="error-text">Intenta nuevamente más tarde.</p>
      </div>`;
    return;
  }
  const temp = weatherData.main.temp;
  const description = weatherData.weather[0].description;
  const iconCode = weatherData.weather[0].icon; 
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('weather-temp').textContent = `${temp}°C`;
  document.getElementById('weather-descrp').textContent = `${description}`;
  document.getElementById('weather-icon-div').innerHTML = `<img src="${iconUrl}" id="weather-icon">`;
}

searchInput.addEventListener('input', async e => {
  e.preventDefault();  
  
  // Devuelve las coincidencias comparado con el value del searchInput
  const similarCountries = countries.filter(countries => 
    countries.name.common.toLowerCase().startsWith(searchInput.value.toLowerCase()) || countries.translations.spa.official.toLowerCase().startsWith(searchInput.value.toLowerCase()) 
  );

  container.innerHTML = '';

  if (similarCountries.length <= 10 && similarCountries.length > 1) {
    similarCountries.forEach(similarCountries => {
      const li = document.createElement('li');
      li.classList.add('country-profile');
      const countryProfile = `
          <img src="${similarCountries.flags.svg}" alt="${similarCountries.flags.alt}" class="country-profile-flag">
          <p class="country-propfile-name">${similarCountries.name.common}</p>
      `;
      const liChildren = `
      ${countryProfile}
      `;
      li.innerHTML = liChildren;    
      container.appendChild(li);
    }); 
  } else if (similarCountries.length === 1) {
  similarCountries.forEach(similarCountries => {
    const li = document.createElement('li');
    li.classList.add('country-finded');
    const countryFind = `
        <div id="principal-data">
        <div id="country-flag-div">
        <img src="${similarCountries.flags.svg}" alt="${similarCountries.flags.alt}" id="country-flag">
        </div>
        <div id="Data-country">
        <p id="country-name">${similarCountries.name.common}</p>
        <p class="country-data">Capital: ${similarCountries.capital}</p>
        <p class="country-data">Poblacion: ${similarCountries.population}</p>
        <p class="country-data">Region: ${similarCountries.region}</p>
        <p class="country-data">Temperatura: ${similarCountries.timezones}</p>
        </div>
        <div id="icon-country-div">
        <span class="material-symbols-outlined" id="icon-country-finded">info</span>
        </div>
        </div>
        <div id="country-finded-weather">
          <div id="weather-data">
          <p id="weather-temp"></p>
          <p id="weather-descrp"></p>
          </div>
          <div id="weather-icon-div">
          </div>
        </div>
      `;
      li.innerHTML = countryFind;
      container.appendChild(li);
      showWeatherCountry(similarCountries.capital[0]);
    });
  } else {
    container.innerHTML = `
      <div class="error-div">
        <span class="material-symbols-outlined" id="error-icon">error</span>
        <p class="error-text">Por favor, especifica tu búsqueda.</p>
      </div>
        `;
  }
});

window.onload = getCountriesFromAPI;