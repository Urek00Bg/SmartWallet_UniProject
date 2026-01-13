const topBtn = document.getElementById("backToTop");

// Когато потребителят скролне 300px надолу, показваме бутона
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};

// При клик - скрол до най-отгоре
topBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Плавно движение
    });
});