import { GEMINI_MODEL, GLOBAL_API_DELAY } from '../constants/agents';

let lastRequestEndTime = 0;

/**
 * Waits for the global API delay to prevent rate limiting.
 */
export async function waitForDelay() {
    const now = Date.now();
    const elapsed = now - lastRequestEndTime;
    if (elapsed < GLOBAL_API_DELAY) {
        const wait = GLOBAL_API_DELAY - elapsed;
        console.log(`[API THROTTLE] Waiting ${Math.round(wait / 1000)}s before next request...`);
        await new Promise(r => setTimeout(r, wait));
    }
}

/**
 * Updates the last request time for throttling.
 */
export function updateLastRequestTime() {
    lastRequestEndTime = Date.now();
}

/**
 * Fetches with retry logic for handling transient errors.
 */
export async function fetchWithRetry(url, options, retries = 3) {
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            console.log(`[API CALL Attempt ${attempt + 1}/${retries + 1}] a ${url}`);
            const res = await fetch(url, options);
            if (res.ok) return res;

            console.warn(`[API ERROR ${res.status}] intento ${attempt + 1} fallido.`);
            
            if (shouldRetry(res.status, attempt, retries)) {
                console.warn(`API ${res.status} Error. Reintentando inmediatamente...`);
                continue;
            }

            return res;
        } catch (error) {
            lastError = error;
            console.error(`[NETWORK ERROR] intento ${attempt + 1}:`, error.message);
            if (attempt < retries) {
                console.warn(`Reintentando red inmediatamente...`);
            }
        }
    }
    if (lastError) throw lastError;
    throw new Error('Fetch failed after all retries');
}

/**
 * Determines if a request should be retried based on status code.
 */
function shouldRetry(status, attempt, retries) {
    if (attempt >= retries) return false;
    
    // Rate limit
    if (status === 429) return true;
    
    // Server errors
    if (status >= 500 && status < 600) return true;
    
    return false;
}

/**
 * Calculates retry delay based on error type and attempt.
 */
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
