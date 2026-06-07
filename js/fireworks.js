// === CANVAS FIREWORKS MODULE ===

/**
 * Initializes and animates the canvas-based fireworks and floating romantic messages
 */
function launchFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
        '#ff0044', '#ff3366', '#ff4d7d', '#ff6699',
        '#ff85b3', '#ffb6c1', '#ff1a6c', '#d61c4e',
        '#ffffff', '#ffd700', '#ffaacc', '#ff69b4'
    ];

    // Romantic messages that appear alongside the fireworks
    const LOVE_MESSAGES = [
        "Tú y yo 💕",
        "Te quiero 🌹",
        "Me encantas ❤️",
        "Eres increíble ✨",
        "Mi niña 💫",
        "Mi vet 💖",
        "Para siempre 🕊️",
        "Gracias por existir 💖",
        "Eres mi paz 🌸",
        "Me haces feliz 😍",
        "Juntos 💑"
    ];

    const particles = [];
    const floatingTexts = [];
    let messageIndex = 0;

    function spawnExplosion(x, y) {
        if (particles.length > 600) return;
        const count = 60;
        const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 7 + 2;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: Math.random() < 0.25 ? COLORS[Math.floor(Math.random() * COLORS.length)] : baseColor,
                size: Math.random() * 4 + 1.5,
                decay: Math.random() * 0.018 + 0.012
            });
        }

        // Launch floating message on each explosion
        const msg = LOVE_MESSAGES[messageIndex % LOVE_MESSAGES.length];
        messageIndex++;
        floatingTexts.push({
            x: x,
            y: y,
            text: msg,
            alpha: 0,
            vy: -1.2,
            life: 0,
            maxLife: 120,
            size: Math.random() * 8 + 22
        });
    }

    // Specialized heart-shaped particle burst
    function spawnHeartBurst(x, y) {
        if (particles.length > 600) return;
        for (let i = 0; i < 14; i++) {
            const angle = (Math.PI * 2 / 14) * i;
            const speed = Math.random() * 4 + 1.5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                alpha: 1,
                isHeart: true,
                size: Math.random() * 16 + 10,
                decay: 0.013
            });
        }
    }

    function animateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const byColor = {};

        // Update and render standard particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.vx *= 0.97; // Friction
            p.vy *= 0.97; // Friction
            p.alpha -= p.decay;

            if (p.alpha <= 0) { particles.splice(i, 1); continue; }

            if (p.isHeart) {
                ctx.globalAlpha = p.alpha;
                ctx.font = `${p.size}px serif`;
                ctx.fillText('❤', p.x, p.y);
            } else {
                if (!byColor[p.color]) byColor[p.color] = [];
                byColor[p.color].push(p);
            }
        }

        // Render color groups for performance
        for (const color in byColor) {
            ctx.fillStyle = color;
            ctx.beginPath();
            for (const p of byColor[color]) {
                ctx.globalAlpha = p.alpha;
                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        // Render floating text messages
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.life++;
            ft.y += ft.vy;

            // Fade in sequence, followed by fade out
            if (ft.life < 25) {
                ft.alpha = ft.life / 25;
            } else if (ft.life > ft.maxLife - 30) {
                ft.alpha = (ft.maxLife - ft.life) / 30;
            } else {
                ft.alpha = 1;
            }

            if (ft.life >= ft.maxLife) { floatingTexts.splice(i, 1); continue; }

            ctx.globalAlpha = ft.alpha;
            ctx.font = `bold ${ft.size}px 'Great Vibes', cursive`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(255, 133, 179, 0.9)';
            ctx.shadowBlur = 15;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.shadowBlur = 0;
            ctx.textAlign = 'left';
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(animateFireworks);
    }

    animateFireworks();

    // Schedule continuous explosions
    let shots = 0;
    const maxShots = 40;
    function scheduleShot() {
        if (shots >= maxShots) return;
        shots++;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.7;
        
        if (shots % 4 === 0) {
            spawnHeartBurst(x, y);
        } else {
            spawnExplosion(x, y);
        }
        
        const delay = shots < 8 ? 200 : 500;
        setTimeout(scheduleShot, delay + Math.random() * 250);
    }
    
    scheduleShot();
}
