/**
 * Sleeps for a given number of milliseconds.
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates how much text to reveal based on elapsed time.
 * Simulates real-time typing effect.
 */
export function calculateRevealLength(totalLength, startTime) {
    const elapsed = Date.now() - startTime;
    const seconds = elapsed / 1000;

    // Revelar por caracteres para simular escritura real (Aumentado para mayor velocidad)
    const charsPerSecond = 2500;
    const revealAmount = Math.floor(seconds * charsPerSecond);

    return Math.min(totalLength, revealAmount);
}

/**
 * Creates an exponential backoff delay for retries.
 */
export function calculateBackoffDelay(attempt, baseDelay = 4000) {
    return baseDelay * (attempt + 1) + Math.random() * 2000;
}
