// --- AUDIO MANAGEMENT MODULE ---
// Handles immediate playback and smooth fade transitions

/**
 * Executes a smooth volume transition for an audio element
 * @param {HTMLAudioElement} audio - The audio element
 * @param {number} startVol - Initial volume level (0.0 to 1.0)
 * @param {number} endVol - Target volume level (0.0 to 1.0)
 * @param {number} duration - Transition duration in milliseconds
 * @param {Function} [callback] - Optional callback function executed upon completion
 */
function fadeAudio(audio, startVol, endVol, duration, callback) {
    const steps = 25;
    const stepTime = duration / steps;
    const volumeStep = (endVol - startVol) / steps;

    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        currentStep++;
        let newVol = startVol + (volumeStep * currentStep);

        if (newVol > 1) newVol = 1;
        if (newVol < 0) newVol = 0;

        audio.volume = newVol;

        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.volume = endVol;
            if (callback) callback();
        }
    }, stepTime);
}

/**
 * Initializes and plays background music with specific fade in/out points
 * designed to seamlessly loop the audio track
 */
function playMusicNow() {
    const music = document.getElementById('bg-music');
    if (!music) return;

    const targetVolume = 0.6;
    music.volume = targetVolume;
    music.currentTime = 6;

    let isFadingOut = false;
    let isFadingIn = false;

    // Start fade out at 220 seconds (3:40)
    const loopStartTime = 220;
    const fadeDuration = 2500; // 2.5 seconds transition

    music.addEventListener('timeupdate', () => {
        // Initiate fade out when approaching the designated end point
        if (music.currentTime >= loopStartTime && !isFadingOut && !isFadingIn) {
            isFadingOut = true;
            fadeAudio(music, targetVolume, 0, fadeDuration, () => {
                // Once silenced, reset to second 6 and fade in again
                music.currentTime = 6;
                music.play();
                isFadingOut = false;
                isFadingIn = true;

                fadeAudio(music, 0, targetVolume, fadeDuration, () => {
                    isFadingIn = false;
                });
            });
        }

        // Safety fallback in case the native loop resets it to the very beginning
        if (music.currentTime < 6 && !isFadingIn && !isFadingOut) {
            music.currentTime = 6;
        }
    });

    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Audio playback successfully initiated.");
        }).catch(error => {
            console.warn("Audio playback failed to initiate. Error:", error);
        });
    }
}
