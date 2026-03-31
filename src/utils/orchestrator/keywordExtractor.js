/**
 * Extracts keywords from a prompt for image searching.
 */
export function extractKeywordsFromPrompt(prompt) {
    const stopWords = new Set([
        'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'para', 'por', 'y', 'o', 'a', 'que', 'es', 'son', 'tiene', 'hacer', 'como', 'mi', 'tu', 'su', 'nos', 'os', 'se', 'le', 'me', 'te', 'yo', 'ello', 'esto', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'cual', 'cuales', 'quien', 'quienes', 'donde', 'cuando', 'porque', 'si', 'no', 'yes', 'the', 'and', 'but', 'in', 'on', 'at', 'to', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);
    const words = prompt.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.has(w));
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w]) => w);
}
