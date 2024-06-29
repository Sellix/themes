// Initialising the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Get the document elements
const headerDiv = document.querySelector('.sellix-header');

// Setting the width and height of the canvas
canvas.width = headerDiv.scrollWidth;
canvas.height = window.innerHeight;

// Setting up the letters
const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';

const alphabet = katakana + latin + nums;

// Setting up the columns
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

// Setting up the drops
const drops = Array(columns).fill(1);

// Setting up the draw function
const draw = () => {
    ctx.fillStyle = 'rgba(5, 6, 5, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drops.forEach((drop, i) => {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillStyle = '#A2AAB4';
        ctx.fillText(text, i * fontSize, drop * fontSize);
        
        drops[i]++;
        
        if (drop * fontSize > canvas.height && Math.random() > .95) {
            drops[i] = 0;
        }
    });
};

// Loop the animation
setInterval(draw, 50);