const apiKey = "8a6b868036b3bad57dfce1a38ced7dfb"; // Tu API key
const lat = "14.6548";
const lon = "-90.6090";
const units = "metric";

const weatherCurrent = document.querySelector('#weather-current');
const weatherForecast = document.querySelector('#weather-forecast');

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();
        const now = data.list[0];
        const iconUrl = `https://openweathermap.org/img/wn/${now.weather[0].icon}@2x.png`;

        weatherCurrent.innerHTML = `
      <img src="${iconUrl}" alt="${now.weather[0].description}">
      <p><strong>${now.main.temp.toFixed(1)}°C</strong> - ${now.weather[0].description}</p>
    `;

        const forecastIndices = [8, 16, 24];
        weatherForecast.innerHTML = forecastIndices
            .map(i => {
                const item = data.list[i];
                const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                });
                return `<div><strong>${date}:</strong> ${item.main.temp.toFixed(1)}°C</div>`;
            })
            .join("");

    } catch (error) {
        console.error("Weather error:", error);
        weatherCurrent.innerHTML = `<p>Weather data unavailable</p>`;
        weatherForecast.innerHTML = "";
    }
}

getWeather();


// ========== SPOTLIGHTS ==========

const spotlightContainer = document.getElementById("spotlight-container");

async function getSpotlightMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Failed to fetch spotlight data");

        const data = await response.json();
        const eligible = data.members.filter(m => m.membership === 1 || m.membership === 2);

        const count = Math.min(3, eligible.length);
        const spotlights = [];

        while (spotlights.length < count) {
            const randIndex = Math.floor(Math.random() * eligible.length);
            const selected = eligible.splice(randIndex, 1)[0];
            spotlights.push(selected);
        }

        spotlights.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo">
        <div class="card-info">
          <h3>${member.name}</h3>
          <p>${member.tagline}</p>
          <p><strong>Email:</strong> ${member.email}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <a href="${member.website}" target="_blank">Visit Website</a>
          <p><strong>Membership:</strong> ${member.membership === 1 ? "Silver" : "Gold"}</p>
        </div>
      `;

            spotlightContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Spotlight error:", error);
        spotlightContainer.innerHTML = `<p>Unable to load spotlight members.</p>`;
    }
}

getSpotlightMembers();

// ========== FOOTER DATES ==========

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// ========== NAV MENU TOGGLE ==========

document.getElementById("menu").addEventListener("click", () => {
    document.querySelector(".navigation").classList.toggle("show");
});