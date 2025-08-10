
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.navigation').classList.toggle('show');
});

document.getElementById("timestamp").value = new Date().toLocaleString();