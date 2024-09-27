function animateSections() {
    const sections = document.querySelectorAll('.sellix-section');

    sections.forEach((section, index) => {
        if (index >= 2) {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.8;

            if (sectionTop < triggerPoint && sectionTop > -section.offsetHeight) {
                if (!section.classList.contains('animate__animated')) {
                    section.classList.add('animate__animated', 'animate__zoomIn');
                    section.style.opacity = 1;
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', animateSections);

document.addEventListener('scroll', animateSections);