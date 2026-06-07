// --- CINEMATIC TIMELINE AND ANIMATIONS MODULE ---

/**
 * Handles the typewriter effect for rendering text incrementally
 * @param {string} text - The full text to type
 * @param {number} index - Current character index
 * @param {HTMLElement} element - Target DOM element
 * @param {number} speed - Base typing speed in milliseconds
 * @param {Function} [callback] - Optional callback upon completion
 */
function typeWriter(text, index, element, speed, callback) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);

        // Auto-scroll logic: scroll the container automatically as text is typed
        const scrollContainer = element.closest('.story-card') || element.closest('.scene');
        if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }

        // Visual effect for line breaks or dramatic pauses on punctuation
        let currentSpeed = speed;
        const char = text.charAt(index);
        if (char === '.' || char === ',' || char === '\n') {
            currentSpeed = speed * 8; // Dramatic pause for punctuation
        }

        setTimeout(() => {
            typeWriter(text, index + 1, element, speed, callback);
        }, currentSpeed);
    } else if (callback) {
        callback();
    }
}

/**
 * Transitions between scenes by toggling the 'active' class
 * @param {HTMLElement} fromScene - The scene to hide
 * @param {HTMLElement} toScene - The scene to show
 */
function changeScene(fromScene, toScene) {
    if (fromScene) fromScene.classList.remove('active');
    if (toScene) toScene.classList.add('active');
}

/**
 * Orchestrates the main automatic timeline sequence, managing scene transitions,
 * text animations, and element visibility timings.
 */
async function startCinematicJourney() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(TIMELINE.introToText);
    changeScene(scenes.intro, scenes.text);

    await sleep(TIMELINE.textToStory);
    changeScene(scenes.text, scenes.story);

    // Display introductory note without typewriter effect
    const introNote = document.querySelector('.intro-note.step-0');
    if (introNote) {
        introNote.classList.add('is-visible');
        await sleep(5000); // Allow time for reading
        introNote.classList.remove('is-visible');
        introNote.classList.add('is-hidden-up');
        await sleep(1500); // Wait for fade out before starting the story
    }

    // Render cards sequentially, dynamically waiting for each to complete
    for (let i = 0; i < 6; i++) {
        const card = document.querySelector(`.story-card.step-${i + 1}`);
        const textContainer = document.getElementById(`story-text-${i + 1}`);

        if (card) {
            card.classList.remove('is-hidden-up');
            card.classList.add('is-visible');
        }

        await sleep(1000); // Wait for fade in

        await new Promise(resolve => {
            typeWriter(STORY_TEXTS[i], 0, textContainer, 40, resolve); // 40ms per letter
        });

        await sleep(3500); // Extra reading time buffer

        if (card) {
            card.classList.remove('is-visible');
            card.classList.add('is-hidden-up');
        }

        await sleep(1500); // Wait for fade out before next card
    }

    // Advance to reasons introduction
    changeScene(scenes.story, scenes.reasonsIntro);

    const reasonsIntroNote = document.querySelector('.intro-note.step-reasons');
    if (reasonsIntroNote) {
        reasonsIntroNote.classList.add('is-visible');
        await sleep(6000); // Allow time for reading
        reasonsIntroNote.classList.remove('is-visible');
        reasonsIntroNote.classList.add('is-hidden-up');
        await sleep(1500); // Fade out before reasons
    }

    changeScene(scenes.reasonsIntro, scenes.reasons);

    await sleep(TIMELINE.reasonsToCards);
    changeScene(scenes.reasons, scenes.cards);

    await sleep(TIMELINE.cardsToFuture);
    changeScene(scenes.cards, scenes.promisesIntro);

    const promisesIntroNote = document.querySelector('.intro-note.step-promises');
    if (promisesIntroNote) {
        promisesIntroNote.classList.add('is-visible');
        await sleep(7000); // Allow time for reading
        promisesIntroNote.classList.remove('is-visible');
        promisesIntroNote.classList.add('is-hidden-up');
        await sleep(1500); // Fade out before promises
    }

    changeScene(scenes.promisesIntro, scenes.promises);

    await sleep(TIMELINE.promisesToHeartbeat);
    changeScene(scenes.promises, scenes.future);

    await sleep(TIMELINE.futureToPromises); // Reading time for the future quote

    // Pre-configure question animations to control them via JS
    const proposalSubtitle = document.querySelector('.proposal-subtitle');
    const proposalButtons = document.querySelector('.proposal-buttons');
    if (proposalSubtitle && proposalButtons) {
        proposalSubtitle.style.transition = 'none';
        proposalSubtitle.style.opacity = '0';
        proposalButtons.style.transition = 'none';
        proposalButtons.style.opacity = '0';
        proposalButtons.style.transform = 'translateY(20px)';
        proposalButtons.style.pointerEvents = 'none';
    }

    changeScene(scenes.future, scenes.question);
    document.body.style.transition = "background-color 5s ease";
    document.body.style.backgroundColor = "#030001";

    // Initiate phrases animation
    await sleep(2500); // Wait for the "Anahí" title to appear

    const phrases = [
        "¿Quieres ser mi amiga...",
        "...y dejar que yo sea tu amigo?",
        "¿Quieres ser mi confidente...",
        "...y permitir que yo escuche cada uno de tus pensamientos?",
        "¿Quieres ser mi amante...",
        "...y dejar que yo sea completamente tuyo?...",
        "¿Quieres ser mi compañera de vida...",
        "...para ser tu paz y que los dos ganemos siempre...",
        "¿Quieres que de ahora en adelante seamos siempre tú y yo?",
        "Dime...",
        "¿Quieres ser mi novia, y dejarme ser tu novio?"
    ];

    if (proposalSubtitle) {
        proposalSubtitle.style.transition = 'opacity 1s ease, transform 1s ease';

        for (let i = 0; i < phrases.length; i++) {
            proposalSubtitle.innerHTML = phrases[i];
            proposalSubtitle.style.transform = 'translateY(15px)';
            proposalSubtitle.style.opacity = '0';

            // Trigger reflow
            proposalSubtitle.offsetHeight;

            // Fade in
            proposalSubtitle.style.opacity = '1';
            proposalSubtitle.style.transform = 'translateY(0)';

            if (i === phrases.length - 1) {
                await sleep(2000);
                if (proposalButtons) {
                    proposalButtons.style.transition = 'opacity 2s ease, transform 2s ease';
                    proposalButtons.style.opacity = '1';
                    proposalButtons.style.transform = 'translateY(0)';
                    proposalButtons.style.pointerEvents = 'auto';
                }
                break;
            }

            await sleep(3000); // Reading time for the phrase

            // Fade out
            proposalSubtitle.style.opacity = '0';
            proposalSubtitle.style.transform = 'translateY(-15px)';
            await sleep(1000); // Wait before showing next phrase
        }
    }
}
