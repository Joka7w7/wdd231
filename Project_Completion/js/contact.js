
const menuBtn = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
});

document.getElementById("timestamp").value = new Date().toLocaleString();