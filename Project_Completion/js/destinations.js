// js/destinations.js
// Inject footer dates
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    const lastModEl = document.getElementById('lastModified');

    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = document.lastModified;
});

// Load destinations from JSON and render cards
async function loadDestinations() {
    try {
        const response = await fetch('data/destinations.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const destinations = await response.json();

        const container = document.getElementById('destinations-list');
        container.innerHTML = '';

        destinations.forEach(dest => {
            const card = document.createElement('article');
            card.className = 'destination-card';

            card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
        <div class="card-content">
          <h2>${dest.name}</h2>
          <p class="location"><strong>Location:</strong> ${dest.location}</p>
          <p class="description">${dest.description}</p>
          <p><strong>Best time to visit:</strong> ${dest.best_time}</p>
          <p><strong>Difficulty:</strong> ${dest.difficulty}</p>
          <p class="tags"><strong>Tags:</strong> ${dest.tags.join(', ')}</p>
        </div>
      `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading destinations:', error);
        const container = document.getElementById('destinations-list');
        if (container) container.textContent = 'Failed to load destinations.';
    }
}

// Wait for DOM loaded to start loading data
window.addEventListener('DOMContentLoaded', loadDestinations);

document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.navigation').classList.toggle('show');
});
