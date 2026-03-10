const canvas = document.getElementById('vaseCanvas');
const ctx = canvas.getContext('2d');

let state = 'GROWING';
let timer = 0;
let flowers = [];
let particles = [];
let bubbles = [];
let ambientFalling = []; // New array for hearts and lilies

class Flower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 0;
        this.maxSize = type === 'lily' ? 1.0 : 0.8;
        this.bloomSpeed = 0.01 + Math.random() * 0.01;
        this.seed = Math.random() * 1000;
        const hydrangeaColors = ['#a29bfe', '#fab1a0', '#81ecec', '#fd79a8'];
        this.color = type === 'lily' ? '#ffffff' : hydrangeaColors[Math.floor(Math.random() * hydrangeaColors.length)];
    }

    draw(time) {
        if (state === 'GROWING' && this.size < this.maxSize) this.size += this.bloomSpeed;
        if (state === 'WIND') this.size -= 0.005;
        
        let sway = Math.sin(time * 0.001 + this.seed) * 0.1;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(sway);
        ctx.scale(this.size, this.size);

        if (this.type === 'lily') {
            drawLilyPetals(ctx);
        } else {
            this.drawHydrangea();
        }
        ctx.restore();
    }

    drawHydrangea() {
        for (let i = 0; i < 30; i++) {
            let px = Math.cos(i) * (i % 5 * 10);
            let py = Math.sin(i) * (i % 5 * 10);
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

// Separate function for reuse in falling animation
function drawLilyPetals(targetCtx) {
    for (let i = 0; i < 6; i++) {
        targetCtx.save();
        targetCtx.rotate((Math.PI * 2 / 6) * i);
        let pGrad = targetCtx.createRadialGradient(0, 5, 0, 0, 30, 60);
        pGrad.addColorStop(0, '#fff');
        pGrad.addColorStop(1, '#ffe3ed');
        targetCtx.beginPath();
        targetCtx.moveTo(0, 0);
        targetCtx.bezierCurveTo(-15, 25, -5, 65, 0, 70);
        targetCtx.bezierCurveTo(5, 65, 15, 25, 0, 0);
        targetCtx.fillStyle = pGrad;
        targetCtx.fill();
        targetCtx.restore();
    }
    targetCtx.fillStyle = "#ffd700";
    targetCtx.beginPath(); targetCtx.arc(0,0,3,0,Math.PI*2); targetCtx.fill();
}

class FallingElement {
    constructor() {
        this.reset();
    }

    reset() {
        // Position them on the left or right 30% of the screen
        const side = Math.random() < 0.5 ? 0 : 0.7;
        this.x = (side * canvas.width) + (Math.random() * canvas.width * 0.3);
        this.y = -100;
        this.speed = 0.5 + Math.random() * 1.5;
        this.type = Math.random() < 0.5 ? 'heart' : 'lily';
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.scale = 0.2 + Math.random() * 0.3;
        this.swing = Math.random() * 1000;
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(Date.now() * 0.001 + this.swing) * 0.5;
        this.rot += this.rotSpeed;
        if (this.y > canvas.height + 100) this.reset();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = 0.7;

        if (this.type === 'heart') {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-20, -20, -40, 10, 0, 40);
            ctx.bezierCurveTo(40, 10, 20, -20, 0, 0);
            ctx.fillStyle = '#ff7aa2';
            ctx.fill();
        } else {
            drawLilyPetals(ctx);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

function triggerBubbles(x, y) {
    for (let i = 0; i < 12; i++) {
        bubbles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 4 - 2,
            r: Math.random() * 6 + 2,
            life: 1
        });
    }
}

function drawWater(cx, cy, time) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy + 120);
    ctx.bezierCurveTo(cx - 140, cy + 220, cx - 140, cy + 330, cx - 70, cy + 390);
    ctx.lineTo(cx + 70, cy + 390);
    ctx.bezierCurveTo(cx + 140, cy + 330, cx + 140, cy + 220, cx + 55, cy + 120);
    ctx.clip();

    const waterGrad = ctx.createLinearGradient(0, cy + 150, 0, cy + 400);
    waterGrad.addColorStop(0, 'rgba(0, 150, 255, 0.2)');
    waterGrad.addColorStop(1, 'rgba(0, 50, 150, 0.4)');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(cx - 200, cy + 150, 400, 300);

    ctx.beginPath();
    ctx.moveTo(cx - 150, cy + 180);
    for (let x = -150; x <= 150; x += 5) {
        let y = Math.sin(x * 0.05 + time * 0.003) * 5;
        ctx.lineTo(cx + x, cy + 180 + y);
    }
    ctx.lineTo(cx + 150, cy + 400);
    ctx.lineTo(cx - 150, cy + 400);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    ctx.restore();
}

function initScene() {
    flowers = [];
    ambientFalling = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 120;
    
    // Vase Flowers
    for (let i = 0; i < 18; i++) {
        let type = Math.random() > 0.4 ? 'hydrangea' : 'lily';
        let rx = cx + (Math.random() - 0.5) * 280;
        let ry = cy + (Math.random() - 0.5) * 180;
        flowers.push(new Flower(rx, ry, type));
    }

    // Initialize ambient elements
    for (let i = 0; i < 15; i++) {
        ambientFalling.push(new FallingElement());
    }
}

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 150;

    timer++;
    if (state === 'GROWING' && timer > 300) state = 'SWAYING';
    if (state === 'SWAYING' && timer > 800) state = 'WIND';
    if (state === 'WIND' && timer > 1100) state = 'RAIN';
    if (state === 'RAIN' && timer > 1400) { state = 'GROWING'; timer = 0; initScene(); }

    // 0. Ambient Falling Elements (Hearts & Lilies)
    ambientFalling.forEach(el => {
        el.update();
        el.draw();
    });

    // 1. Water & Stems
    drawWater(cx, cy, time);
    
    ctx.strokeStyle = "rgba(40, 80, 40, 0.3)";
    flowers.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + 300);
        ctx.quadraticCurveTo(cx, cy + 150, f.x, f.y);
        ctx.stroke();
    });

    // 2. Flowers
    flowers.forEach(f => f.draw(time));

    // 3. Bubbles
    bubbles.forEach((b, i) => {
        b.x += b.vx; b.y += b.vy; b.life -= 0.01;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${b.life})`;
        ctx.stroke();
        if (b.life <= 0) bubbles.splice(i, 1);
    });

    // 4. Vase Front
    const vGrad = ctx.createLinearGradient(cx - 100, 0, cx + 100, 0);
    vGrad.addColorStop(0, 'rgba(20, 30, 48, 0.9)');
    vGrad.addColorStop(0.5, 'rgba(100, 120, 160, 0.2)');
    vGrad.addColorStop(1, 'rgba(20, 30, 48, 0.9)');
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy + 100);
    ctx.bezierCurveTo(cx - 150, cy + 200, cx - 150, cy + 350, cx - 70, cy + 400);
    ctx.lineTo(cx + 70, cy + 400);
    ctx.bezierCurveTo(cx + 150, cy + 350, cx + 150, cy + 200, cx + 60, cy + 100);
    ctx.fillStyle = vGrad; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.stroke();

    requestAnimationFrame(animate);
}

initScene();
animate(0);
