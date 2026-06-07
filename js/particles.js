// --- BACKGROUND PARTICLES GENERATION MODULE ---

/**
 * Creates dynamic background particles including floating bokeh elements 
 * and floating hearts to enhance the visual ambiance
 */
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 20;
    const heartCount = 15;

    // Generate floating bokeh particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 80 + 30;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 12}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        container.appendChild(particle);
    }

    // Generate initial floating hearts
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 10}s`;
        heart.style.animationDuration = `${Math.random() * 8 + 8}s`;
        heart.style.fontSize = `${Math.random() * 15 + 12}px`;
        container.appendChild(heart);
    }
}
