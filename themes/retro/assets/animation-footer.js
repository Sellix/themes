document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('dot-container');
    const canvas = document.createElement('canvas');
    canvas.width = 956;
    canvas.height = 38;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const dotSize = 3;
    const gap = 3;
    const dotsPerRow = Math.floor(canvas.width / (dotSize + gap));
    const dotsPerColumn = Math.floor(canvas.height / (dotSize + gap));
    const totalDots = dotsPerRow * dotsPerColumn;

    const dots = [];

    for (let i = 0; i < totalDots; i++) {
        const x = (i % dotsPerRow) * (dotSize + gap);
        const y = Math.floor(i / dotsPerRow) * (dotSize + gap);
        const opacity = Math.random() * 0.56 + 0.07; 
        dots.push({ x, y, opacity, direction: Math.random() > 0.5 ? 1 : -1 });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(dot => {
            dot.opacity += 0.0025 * dot.direction;
            if (dot.opacity <= 0.07 || dot.opacity >= 0.56) {
                dot.direction *= -1;
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
            ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
        });
        requestAnimationFrame(animate);
    }

    animate();
});