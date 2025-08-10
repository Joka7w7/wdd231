
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.navigation').classList.toggle('show');
});

document.getElementById("timestamp").value = new Date().toLocaleString();

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    const lastModEl = document.getElementById('lastModified');

    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = document.lastModified;
});