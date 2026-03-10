const canvas = document.getElementById('vaseCanvas');
const ctx = canvas.getContext('2d');

let state = 'GROWING'; // GROWING, SWAYING, WIND, RAIN
let timer = 0;
let particles = [];
let flowers = [];
let rainDrops = [];

class Flower {
    constructor(x, y, type, delay) {
        this.x = x;
        this.y = y;
        this.type = type; // 'lily' or 'hydrangea'
        this.size = 0;
        this.maxSize = type === 'lily' ? 1 : 0.8;
        this.delay = delay;
        this.angle = 0;
    }

    draw(time) {
        if (this.size < this.maxSize && state === 'GROWING') this.size += 0.005;
        if (state === 'WIND') this.size -= 0.002;
        
        this.angle = Math.sin(time * 0.002 + this.x) * 0.05;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.size, this.size);

        if (this.type === 'lily') {
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.rotate((Math.PI * 2) / 6);
                ctx.ellipse(0, 30, 12, 45, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 245, ${this.size})`;
                ctx.fill();
            }
        } else {
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                let rx = Math.cos(i) * 30;
                let ry = Math.sin(i) * 30;
                ctx.arc(rx, ry, 10, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(162, 155, 254, ${this.size})`;
                ctx.fill();
            }
        }
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, isDove = false) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = Math.random() * 2 + 1;
        this.isDove = isDove;
        this.life = 1;
    }

    update() {
        if (state === 'WIND') {
            this.vx += 0.2; // Blow away
            this.vy -= 0.1;
            if (this.vx > 5) this.isDove = true; 
        }
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.isDove) {
            // Draw a simple "V" shape for a majestic dove
            ctx.beginPath();
            let flap = Math.sin(Date.now() * 0.01) * 10;
            ctx.moveTo(-10, flap);
            ctx.quadraticCurveTo(0, -5, 10, flap);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#ffb7c5";
            ctx.fill();
        }
        ctx.restore();
    }
}

function initScene() {
    flowers = [
        new Flower(450, 250, 'lily', 0),
        new Flower(380, 280, 'hydrangea', 10),
        new Flower(520, 280, 'hydrangea', 20),
        new Flower(450, 180, 'lily', 30)
    ];
    particles = [];
}

function drawVase(cx, cy) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 100);
    ctx.bezierCurveTo(cx - 100, cy, cx - 100, cy + 150, cx - 50, cy + 200);
    ctx.lineTo(cx + 50, cy + 200);
    ctx.bezierCurveTo(cx + 100, cy + 150, cx + 100, cy, cx + 50, cy - 100);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.stroke();
}

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 50;

    // Handle States
    timer++;
    if (state === 'GROWING' && timer > 200) state = 'SWAYING';
    if (state === 'SWAYING' && timer > 500) state = 'WIND';
    if (state === 'WIND' && timer > 800) {
        state = 'RAIN';
        document.body.style.background = "#070b14";
    }
    if (state === 'RAIN' && timer > 1100) {
        state = 'GROWING';
        timer = 0;
        document.body.style.background = "radial-gradient(circle at center, #14213d, #0b132b)";
        initScene();
    }

    // Draw Stems
    ctx.strokeStyle = "#2d4a22";
    ctx.lineWidth = 4;
    flowers.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx, f.y + 50, f.x, f.y);
        ctx.stroke();
    });

    // Draw Flowers
    flowers.forEach(f => f.draw(time));

    // Petals & Doves
    if (state === 'SWAYING' && Math.random() < 0.05) {
        particles.push(new Particle(cx + (Math.random()-0.5)*100, cy - 200));
    }
    
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.x > canvas.width || p.y > canvas.height) particles.splice(i, 1);
    });

    // Rain
    if (state === 'RAIN') {
        ctx.strokeStyle = "rgba(174, 194, 224, 0.5)";
        for(let i=0; i<10; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 15);
            ctx.stroke();
        }
    }

    drawVase(cx, cy);
    requestAnimationFrame(animate);
}

initScene();
animate(0);
