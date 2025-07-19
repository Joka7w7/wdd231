const directory = document.querySelector("#directory");
const gridButton = document.querySelector("#gridView");
const listButton = document.querySelector("#listView");

async function getMemberData() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Failed to fetch member data");
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error("Error loading member data:", error);
    }
}

function displayMembers(members) {
    directory.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Only add image if grid view is active
        if (directory.classList.contains("grid")) {
            const img = document.createElement("img");
            img.src = `images/${member.image}`;
            img.alt = `${member.name} logo`;
            card.appendChild(img);
        }

        // COLUMN 1: Name & Description
        const col1 = document.createElement("div");
        col1.classList.add("column");
        const name = document.createElement("h3");
        name.textContent = member.name;
        const desc = document.createElement("p");
        desc.textContent = member.tagline;
        col1.appendChild(name);
        col1.appendChild(desc);
        card.appendChild(col1);

        // COLUMN 2: Contact Info
        const col2 = document.createElement("div");
        col2.classList.add("column");
        const email = document.createElement("p");
        email.textContent = member.email;
        const phone = document.createElement("p");
        phone.textContent = member.phone;
        col2.appendChild(email);
        col2.appendChild(phone);
        card.appendChild(col2);

        // COLUMN 3: Website link
        const col3 = document.createElement("div");
        col3.classList.add("column");
        const link = document.createElement("a");
        link.href = member.website;
        link.target = "_blank";
        link.textContent = "Visit Website";
        col3.appendChild(link);
        card.appendChild(col3);

        directory.appendChild(card);
    });
}

// View toggle handlers
gridButton.addEventListener("click", () => {
    directory.classList.add("grid");
    directory.classList.remove("list");
    getMemberData(); // re-render to include images
});

listButton.addEventListener("click", () => {
    directory.classList.add("list");
    directory.classList.remove("grid");
    getMemberData(); // re-render to exclude images
});

document.getElementById("menu").addEventListener("click", () => {
    document.querySelector(".navigation").classList.toggle("show");
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// weather API integration
const apiKey = "8a6b868036b3bad57dfce1a38ced7dfb";
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