export function downloadHTML(html, filename = 'landing.html') {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function downloadJSON(data, filename = 'blueprint.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function printReport() {
    window.print();
}

/**
 * Basic HTML formatter for pretty-printing source code.
 */
/**
 * Improved HTML formatter for AI-generated code.
 */
export function formatHTML(html) {
    if (!html) return '';
    const tab = '    ';
    let result = '';
    let indent = '';

    // Remove existing whitespace/newlines between tags to start from a clean slate
    const cleanHtml = html.replace(/>\s*</g, '><').trim();

    cleanHtml.split(/(?=<)|(?<=>)/).filter(Boolean).forEach((element) => {
        if (element.startsWith('</')) {
            indent = indent.substring(tab.length);
            result += indent + element + '\r\n';
        } else if (element.startsWith('<') && !element.startsWith('<!--') && !element.endsWith('/>') && !element.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
            result += indent + element + '\r\n';
            indent += tab;
        } else {
            result += indent + element + '\r\n';
        }
    });

    return result.trim();
}

/**
 * Lightweight syntax highlighter for HTML.
 */
export function highlightHTML(code) {
    if (!code) return '';

    return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("[^"]*"|'[^']*')/g, '<span class="sh-val">$1</span>') // strings
        .replace(/(&lt;\/?[a-z1-6]+)/gi, '<span class="sh-tag">$1</span>') // tags
        .replace(/(&gt;)/g, '<span class="sh-tag">$1</span>') // closing bracket
        .replace(/\s([a-z-]+)=/gi, ' <span class="sh-attr">$1</span>=') // attributes
        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="sh-comm">$1</span>'); // comments
}
