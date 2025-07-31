document.getElementById("menu").addEventListener("click", () => {
    document.querySelector(".navigation").classList.toggle("show");
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// Visit message using localStorage
const message = document.getElementById("visit-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
    message.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
    message.textContent = days < 1
        ? "Back so soon! Awesome!"
        : `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
}

localStorage.setItem("lastVisit", now);

// Load JSON and create cards
fetch("data/discover.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("discover-cards");
        data.forEach((item, i) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
        <h2>${item.title}</h2>
        <figure><img src="${item.image}" alt="${item.title}" loading="lazy" /></figure>
        <address>${item.address}</address>
        <p>${item.description}</p>
        <button>Learn more</button>
      `;
            container.appendChild(card);
        });
    });



