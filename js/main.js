// --- MAIN INITIALIZATION AND EVENT BINDING MODULE ---

// Global DOM elements state
const scenes = {};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scene references
    scenes.intro = document.getElementById('scene-intro');
    scenes.text = document.getElementById('scene-text1');
    scenes.story = document.getElementById('scene-story');
    scenes.reasonsIntro = document.getElementById('scene-reasons-intro');
    scenes.reasons = document.getElementById('scene-reasons');
    scenes.cards = document.getElementById('scene-cards');
    scenes.future = document.getElementById('scene-future');
    scenes.promisesIntro = document.getElementById('scene-promises-intro');
    scenes.promises = document.getElementById('scene-promises');
    scenes.question = document.getElementById('scene-question');
    scenes.celebration = document.getElementById('scene-celebration');

    // Initialize stable background particles
    createParticles();

    // Setup start button event listener
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // 1. Immediate visual feedback: disable button and trigger intro fade-out
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            if (scenes.intro) scenes.intro.classList.remove('active');

            // 2. Initiate background music
            playMusicNow();

            // 3. Begin the cinematic sequence
            startCinematicJourney();
        });
    }

    // Setup interactive logic for the final question scene
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    // Handle 'YES' button click
    if (btnYes) {
        btnYes.addEventListener('click', () => {
            changeScene(scenes.question, scenes.celebration);
            
            // Hide the 'No' button in case it was moved to the body
            if (btnNo) btnNo.style.display = 'none';
            
            // Trigger immediate celebration fireworks
            launchFireworks();
            
            // Stagger animation for celebration text lines
            const lines = document.querySelectorAll('.celebration-line');
            lines.forEach((line, i) => {
                setTimeout(() => line.classList.add('visible'), 800 + i * 1500);
            });
        });
    }

    // Prevent rapid hover loop during smooth slide transitions
    let isEscaping = false;

    /**
     * Repositions the 'NO' button randomly across the viewport
     */
    function moveNoButton() {
        if (isEscaping || !btnNo) return;
        isEscaping = true;

        // Detach from flex container to utilize absolute screen coordinates accurately
        if (btnNo.parentElement.tagName !== 'BODY') {
            const rect = btnNo.getBoundingClientRect();
            btnNo.style.width = `${btnNo.offsetWidth}px`;
            btnNo.style.height = `${btnNo.offsetHeight}px`;
            btnNo.style.left = `${rect.left}px`;
            btnNo.style.top = `${rect.top}px`;
            btnNo.style.margin = '0';
            btnNo.style.position = 'fixed';
            btnNo.style.zIndex = '9999';
            document.body.appendChild(btnNo);

            // Trigger reflow to ensure the transition originates from the current state
            btnNo.offsetHeight;
        }

        const padding = 20; // Viewport safety boundary
        const maxX = window.innerWidth - btnNo.clientWidth - padding;
        const maxY = window.innerHeight - btnNo.clientHeight - padding;

        // Calculate random coordinates ensuring they remain within screen boundaries
        const randomX = Math.max(padding, Math.random() * Math.max(0, maxX));
        const randomY = Math.max(padding, Math.random() * Math.max(0, maxY));

        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;

        // Brief cooldown timer allows quick successive escapes
        setTimeout(() => {
            isEscaping = false;
        }, 200);
    }

    // The 'NO' button evades mouse interactions and touch inputs
    if (btnNo) {
        btnNo.addEventListener('mouseover', moveNoButton);
        btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevents touch trigger on mobile devices
            moveNoButton();
        });
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            moveNoButton();
        });
    }
});
