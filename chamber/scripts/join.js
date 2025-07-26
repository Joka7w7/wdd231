document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// ========== NAV MENU TOGGLE ==========

document.getElementById("menu").addEventListener("click", () => {
    document.querySelector(".navigation").classList.toggle("show");
});

document.getElementById("timestamp").value = new Date().toLocaleString();

document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll(".open-modal");
    const closeButtons = document.querySelectorAll(".close-button");

    openButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute("data-modal");
            document.getElementById(modalId).style.display = "block";
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });
});