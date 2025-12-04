const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks")
const links = navLinks.querySelectorAll("a")

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    if (navLinks.classList.contains("active")) {
        menuBtn.innerHTML = "✕";
        menuBtn.setAttribute("aria-expanded", "true")
    } else {
        menuBtn.innerHTML = "☰";
        menuBtn.setAttribute("aria-expanded",
            "false")
    }
});

links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.innerHTML = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
    })
})