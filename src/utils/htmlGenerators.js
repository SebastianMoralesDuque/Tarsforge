export function createHeader(title, description) {
  return `<header>
  <h1>${title}</h1>
  <p>${description}</p>
</header>`;
}

export function createSection(id, title, content) {
  return `<section id="${id}">
  <h2>${title}</h2>
  ${content}
</section>`;
}

export function createWhatIs(title, description) {
  return `<section id="que-es">
  <h2>${title}</h2>
  <p>${description}</p>
</section>`;
}

export function createSteps(title, steps) {
  var stepsHtml = steps.map(function(step) {
    return `    <li>${step}</li>`;
  }).join('\n');

  return `<section id="como-funciona">
  <h2>${title}</h2>
  <ol>
${stepsHtml}
  </ol>
</section>`;
}

export function createList(title, items, id) {
  var listItems = items.map(function(item) {
    return `    <li>${item}</li>`;
  }).join('\n');

  return `<section id="${id}">
  <h2>${title}</h2>
  <ul>
${listItems}
  </ul>
</section>`;
}

export function createFAQ(faqs) {
  var faqItems = faqs.map(function(faq) {
    return `  <h3>${faq.question}</h3>
  <p>${faq.answer}</p>`;
  }).join('\n\n');

  return `<section id="faq">
  <h2>Preguntas frecuentes</h2>
${faqItems}
</section>`;
}

export function generateJSONLD(faqs) {
  var schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(function(faq) {
      return {
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      };
    })
  };

  return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

export function createCompleteLanding(config) {
  var html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${config.metaDescription || config.description || ''}">
  <title>${config.title || config.name || 'Landing Page'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    header {
      text-align: center;
      padding: 3rem 1rem;
      border-bottom: 1px solid #eee;
    }

    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #111;
    }

    header p {
      font-size: 1.25rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }

    section {
      padding: 3rem 1rem;
      border-bottom: 1px solid #eee;
    }

    section h2 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      color: #111;
    }

    section h3 {
      font-size: 1.25rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #333;
    }

    section p {
      font-size: 1.1rem;
      color: #444;
      max-width: 800px;
    }

    section ul, section ol {
      margin-left: 1.5rem;
      max-width: 800px;
    }

    section ul li, section ol li {
      font-size: 1.1rem;
      color: #444;
      margin-bottom: 0.5rem;
    }

    #faq h3 {
      font-weight: 600;
    }

    #faq p {
      margin-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
      body {
        padding: 2rem;
      }

      header {
        padding: 4rem 2rem;
      }

      section {
        padding: 4rem 2rem;
      }
    }
  </style>
</head>
<body>
${createHeader(config.name, config.description)}
${createWhatIs(config.whatIsTitle || '¿Qué es?', config.whatIsDescription || config.description)}
${createSteps(config.stepsTitle || '¿Cómo funciona?', config.steps || [])}
${createList(config.useCasesTitle || 'Casos de uso', config.useCases || [], 'casos-de-uso')}
${createList(config.advantagesTitle || 'Ventajas', config.advantages || [], 'ventajas')}
${createFAQ(config.faqs || [])}
${generateJSONLD(config.faqs || [])}
</body>
</html>`;

  return html;
}

export default {
  createHeader,
  createSection,
  createWhatIs,
  createSteps,
  createList,
  createFAQ,
  generateJSONLD,
  createCompleteLanding
};