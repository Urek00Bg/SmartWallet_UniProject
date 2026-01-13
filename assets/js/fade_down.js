document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-down');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.5 });
        
        if (document.body.clientWidth >= 768) {
            fadeElements.forEach(element => {
                observer.observe(element);
            });
        }else{
            fadeElements.forEach(element => {
                element.classList.add('visible');
            });
        }

});