document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburgerIcon = navToggle ? navToggle.querySelector('i') : null;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if(hamburgerIcon) hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
        });
    });
});