const destinationSelect = document.getElementById('destination-select');
const savePlanBtn = document.getElementById('save-plan');
const tripDateFromInput = document.getElementById('trip-date-from');
const tripDateToInput = document.getElementById('trip-date-to');
const savedTripsList = document.getElementById('saved-trips-list');
const clearTripsBtn = document.getElementById('clear-trips');

const destNameEl = document.getElementById('dest-name');
const destImageEl = document.getElementById('dest-image');
const destDescriptionEl = document.getElementById('dest-description');
const destLocationEl = document.getElementById('dest-location');
const destBestTimeEl = document.getElementById('dest-best-time');
const destDifficultyEl = document.getElementById('dest-difficulty');
const destTagsEl = document.getElementById('dest-tags');
const weatherDisplayEl = document.getElementById('weather-display');

const apiKey = "8a6b868036b3bad57dfce1a38ced7dfb"; // Your API key
let destinations = [];
let selectedDestinationId = null;

/* --------------------
   LOAD DESTINATIONS
-------------------- */
async function loadDestinations() {
    try {
        const response = await fetch('data/destinations.json');
        if (!response.ok) throw new Error('Failed to fetch destinations data');
        destinations = await response.json();

        destinationSelect.innerHTML = `<option value="">-- Select a destination --</option>` +
            destinations.map(dest => `<option value="${dest.id}">${dest.name} (${dest.location})</option>`).join('');
    } catch (error) {
        destinationSelect.innerHTML = `<option value="">Error loading destinations</option>`;
        weatherDisplayEl.textContent = `Error loading destinations: ${error.message}`;
    }
}

/* --------------------
   DESTINATION CHANGE
-------------------- */
async function onDestinationChange(id) {
    selectedDestinationId = id;

    if (!id) {
        clearDestinationDetails();
        weatherDisplayEl.textContent = 'Select a destination to see weather info.';
        return;
    }

    const dest = destinations.find(d => d.id.toString() === id);
    if (!dest) {
        clearDestinationDetails();
        weatherDisplayEl.textContent = 'Destination not found.';
        return;
    }

    // Show destination details
    destNameEl.textContent = dest.name;
    destImageEl.src = dest.image;
    destImageEl.alt = `Photo of ${dest.name}`;
    destDescriptionEl.textContent = dest.description;
    destLocationEl.textContent = dest.location;
    destBestTimeEl.textContent = dest.best_time;
    destDifficultyEl.textContent = dest.difficulty;
    destTagsEl.textContent = dest.tags.join(', ');
    document.getElementById('destination-details').hidden = false;

    // Show weather for this destination
    await showWeather(dest);
}

/* --------------------
   SHOW WEATHER
-------------------- */
async function showWeather(dest) {
    if (!dest.lat || !dest.lon) {
        weatherDisplayEl.textContent = 'No coordinates for weather data.';
        return;
    }

    try {
        weatherDisplayEl.textContent = 'Loading weather...';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${dest.lat}&lon=${dest.lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch weather');

        const data = await res.json();
        const now = data.list[0];
        const iconUrl = `https://openweathermap.org/img/wn/${now.weather[0].icon}@2x.png`;

        const forecastIndices = [8, 16, 24]; // 1, 2, 3 days ahead
        const forecastHtml = forecastIndices.map(i => {
            const item = data.list[i];
            const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            return `<div><strong>${date}:</strong> ${item.main.temp.toFixed(1)}°C, ${item.weather[0].description}</div>`;
        }).join('');

        weatherDisplayEl.innerHTML = `
            <h3>Weather in ${dest.name}</h3>
            <div class="current-weather">
                <img src="${iconUrl}" alt="${now.weather[0].description}">
                <p><strong>${now.main.temp.toFixed(1)}°C</strong> - ${now.weather[0].description}</p>
            </div>
            <div class="forecast-weather">${forecastHtml}</div>
        `;
    } catch (error) {
        weatherDisplayEl.textContent = `Error fetching weather: ${error.message}`;
    }
}

/* --------------------
   CLEAR DETAILS
-------------------- */
function clearDestinationDetails() {
    document.getElementById('destination-details').hidden = true;
    destNameEl.textContent = '';
    destImageEl.src = '';
    destDescriptionEl.textContent = '';
    destLocationEl.textContent = '';
    destBestTimeEl.textContent = '';
    destDifficultyEl.textContent = '';
    destTagsEl.textContent = '';
}

/* --------------------
   SAVE TRIPS
-------------------- */
function getSavedTrips() {
    return JSON.parse(localStorage.getItem('savedTrips') || '[]');
}

function saveTripsToStorage(trips) {
    localStorage.setItem('savedTrips', JSON.stringify(trips));
}

function renderSavedTrips() {
    const trips = getSavedTrips();
    savedTripsList.innerHTML = trips.length
        ? trips.map(trip => `
            <li>
                <strong>${trip.destination}</strong><br>
                ${trip.from} → ${trip.to}<br>
                ${trip.weather.temp}°C, ${trip.weather.description}
            </li>
        `).join('')
        : '<li>No trips saved yet.</li>';
}

async function saveTrip() {
    if (!selectedDestinationId) {
        alert('Please select a destination first.');
        return;
    }
    if (!tripDateFromInput.value || !tripDateToInput.value) {
        alert('Please select both From and To dates.');
        return;
    }
    if (tripDateFromInput.value > tripDateToInput.value) {
        alert('"From" date cannot be after "To" date.');
        return;
    }

    const dest = destinations.find(d => d.id.toString() === selectedDestinationId);
    if (!dest) return;

    try {
        // Get current weather at save time
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${dest.lat}&lon=${dest.lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch weather');
        const weatherData = await res.json();

        const newTrip = {
            destination: dest.name,
            from: tripDateFromInput.value,
            to: tripDateToInput.value,
            weather: {
                temp: weatherData.main.temp.toFixed(1),
                description: weatherData.weather[0].description
            }
        };

        const trips = getSavedTrips();
        trips.push(newTrip);
        saveTripsToStorage(trips);
        renderSavedTrips();
        alert('Trip plan saved!');
    } catch (error) {
        alert(`Error saving trip: ${error.message}`);
    }
}

clearTripsBtn.addEventListener('click', () => {
    if (confirm('Clear all saved trips?')) {
        localStorage.removeItem('savedTrips');
        renderSavedTrips();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
    renderSavedTrips();
});

/* --------------------
   EVENT LISTENERS
-------------------- */
destinationSelect.addEventListener('change', e => onDestinationChange(e.target.value));
savePlanBtn.addEventListener('click', saveTrip);

/* --------------------
   INITIALIZE
-------------------- */
document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
    renderSavedTrips();
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
});

document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.navigation').classList.toggle('show');
});
