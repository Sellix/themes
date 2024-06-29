document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    const noiseCanvas = document.createElement('canvas');
    const noiseCtx = noiseCanvas.getContext('2d');
    const noiseResolution = 256;
    noiseCanvas.width = noiseResolution;
    noiseCanvas.height = noiseResolution;

    function generateNoise(ctx, width, height) {
        const imageData = ctx.createImageData(width, height);
        const buffer32 = new Uint32Array(imageData.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            buffer32[i] = ((255 * Math.random()) | 0) << 24;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function drawNoise() {
        generateNoise(noiseCtx, noiseCanvas.width, noiseCanvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(noiseCanvas, 0, 0, canvas.width, canvas.height);
    }

    function animate() {
        drawNoise();
        setTimeout(animate, 100);
    }

    animate();

    window.addEventListener('resize', resizeCanvas);
});