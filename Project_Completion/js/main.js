// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const featuredDestinations = await getFeaturedDestinations(3);
        renderFeatured(featuredDestinations);
    } catch (error) {
        console.error("Error loading featured destinations:", error);
    }

    // Footer year and last modified
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
});

async function getFeaturedDestinations(count = 3) {
    const response = await fetch('data/destinations.json');
    if (!response.ok) throw new Error("Failed to load destinations");

    const destinations = await response.json();
    return shuffle(destinations).slice(0, count);
}

function shuffle(array) {
    return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

function renderFeatured(destinations) {
    const container = document.getElementById('destinations-list');
    container.innerHTML = ''; // Clear old content

    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.classList.add('destination-card');

        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}" loading="lazy">
            <div class="card-content">
            <h2>${dest.name}</h2>
            <p class="location"><strong>Location:</strong> ${dest.location}</p>
            <p class="description">${dest.description}</p>
            <a href="destinations.html#${dest.id}" class="more-info">More Info</a>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector("nav ul");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
});

