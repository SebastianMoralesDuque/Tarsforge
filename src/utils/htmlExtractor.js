/**
 * Extracts valid HTML from a potentially markdown-wrapped string.
 * Validates for <!DOCTYPE or <html> and auto-closes if missing.
 */
export function extractValidHTML(raw) {
    if (!raw) return null;

    let html = raw.trim();

    // 1. Intentar extraer de bloques de código Markdown (el más común)
    const codeBlockMatch = html.match(/```html\s*([\s\S]*?)(?:```|$)/i);
    if (codeBlockMatch) {
        return ensureHtmlClosure(codeBlockMatch[1].trim());
    }

    // 2. Si el texto empieza con backticks pero no dice html, limpiar igual
    if (html.startsWith('```')) {
        html = html.replace(/^```(\w+)?\n?/i, '').replace(/```$/g, '').trim();
    }

    // 3. Si ya parece ser un HTML completo o casi completo, confiar
    if (isValidHtmlStart(html)) {
        return ensureHtmlClosure(html);
    }

    // 4. Extraer bloque HTML si está enterrado en texto explicativo (ej: "Aquí tienes el código: <html>...")
    const htmlBlock = extractHtmlBlock(html);
    if (htmlBlock) {
        return ensureHtmlClosure(htmlBlock);
    }

    // 5. Fallback agresivo: buscar desde el primer tag que parezca estructural
    const structuralMatch = html.match(/<(?:!DOCTYPE|html|head|body|header|nav|main|section|div)[\s\S]*/i);
    if (structuralMatch) {
        return ensureHtmlClosure(structuralMatch[0]);
    }

    // 6. Si no hay nada de lo anterior, pero hay algún tag, devolverlo todo y que ensureHtmlClosure lo arregle
    if (html.includes('<')) {
        return ensureHtmlClosure(html);
    }

    return null;
}

/**
 * Checks if text starts with valid HTML doctype or html tag, allowing for comments/whitespace.
 */
function isValidHtmlStart(html) {
    const trimmed = html.trim().replace(/^<!--[\s\S]*?-->\s*/g, '').trim();
    return /^<!DOCTYPE\s+html/i.test(trimmed) || /^<html/i.test(trimmed);
}

/**
 * Ensures HTML has proper closing tags, handling cut-off content.
 */
function ensureHtmlClosure(html) {
    if (!html) return '';
    let cleaned = html.trim();

    // 1. Eliminar tags cortados al final (ej: <div cla o <p)
    // Solo si el último caracter no es > y hay un tag abierto
    if (!cleaned.endsWith('>') && cleaned.lastIndexOf('<') > cleaned.lastIndexOf('>')) {
        cleaned = cleaned.substring(0, cleaned.lastIndexOf('<')).trim();
    }

    const lowerCleaned = cleaned.toLowerCase();
    const hasHtmlOpen = lowerCleaned.includes('<html');
    const hasBodyOpen = lowerCleaned.includes('<body');
    const hasHeadOpen = lowerCleaned.includes('<head');

    // 2. Asegurar aperturas estructurales
    if (!hasHtmlOpen) {
        cleaned = '<html lang="es">\n' + cleaned;
    }

    if (!hasBodyOpen) {
        if (lowerCleaned.includes('</head>')) {
            cleaned = cleaned.replace(/<\/head>/i, '$&\n<body>');
        } else if (!hasHeadOpen) {
            // Si no hay body ni head, insertar body tras html
            cleaned = cleaned.replace(/<html[^>]*>/i, '$&\n<body>');
        }
        // Si hay head pero no está cerrado (truncado), no insertamos body todavía;
        // se añadirá al final junto con los cierres automáticos.
    }

    // 3. Asegurar cierres en orden correcto (de adentro hacia afuera)
    if (hasHeadOpen && !lowerCleaned.includes('</head>')) {
        if (lowerCleaned.includes('</body>')) {
            cleaned = cleaned.replace(/<body/i, '</head>\n$&');
        } else if (lowerCleaned.includes('</html>')) {
            cleaned = cleaned.replace(/<\/html/i, '</head>\n$&');
        } else {
            cleaned += '\n</head>';
        }
    }

    if (!lowerCleaned.includes('</body>')) {
        if (lowerCleaned.includes('</html>')) {
            cleaned = cleaned.replace(/<\/html\s*>/i, '</body>\n$&');
        } else {
            cleaned += '\n<body>\n</body>'; // Añadir body vacío si faltaba
        }
    }

    if (!cleaned.toLowerCase().includes('</html>')) {
        cleaned += '\n</html>';
    }

    // 4. Asegurar DOCTYPE al principio de todo
    if (!cleaned.toLowerCase().includes('<!doctype')) {
        cleaned = '<!DOCTYPE html>\n' + cleaned;
    }

    return cleaned;
}

/**
 * Extracts HTML block from text, allowing for incomplete blocks.
 */
function extractHtmlBlock(text) {
    // Buscar inicio de DOCTYPE o html
    const startRegex = /(<!DOCTYPE[\s\S]*?|<html[\s\S]*?)/i;
    const match = text.match(startRegex);
    
    if (!match) return null;

    const startIndex = match.index;
    let content = text.substring(startIndex);

    // Intentar encontrar el cierre formal
    const endMatch = content.match(/<\/html\s*>/i);
    if (endMatch) {
        const endIndex = endMatch.index + endMatch[0].length;
        return content.substring(0, endIndex);
    }

    // Si no hay cierre, devolver desde el inicio (ensureHtmlClosure se encargará del resto)
    return content;
}
