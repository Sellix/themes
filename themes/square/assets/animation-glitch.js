document.addEventListener('scroll', function () {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(glitchElement => {
        const elementTop = glitchElement.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;

        if (elementTop < triggerPoint && elementTop > -glitchElement.offsetHeight) {
            if (!glitchElement.classList.contains('is-glitching')) {
                glitchElement.classList.add('is-glitching');
                glitchElement.setAttribute('data-text', glitchElement.textContent);
            }
        }
    });
});
