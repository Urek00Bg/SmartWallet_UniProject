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

        const hasAcceptedAlert = localStorage.getItem('acceptedDemoAlert');
        if (!hasAcceptedAlert) {
            alert("This is a demo website, created for university purposes. Everything is stored locally in your browser and no data is sent to any server.");
            localStorage.setItem('acceptedDemoAlert', 'true');
        }

});