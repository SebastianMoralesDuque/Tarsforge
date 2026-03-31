const UNSPLASH_BASE = 'https://api.unsplash.com/photos/random';

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function validateImageUrl(url, timeout = 8000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return false;
    const contentType = res.headers.get('content-type');
    return contentType && contentType.startsWith('image/');
  } catch {
    return false;
  }
}

export async function getImage(keyword, retries = 3) {
  const encodedKeyword = encodeURIComponent(keyword);
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        `${UNSPLASH_BASE}?query=${encodedKeyword}&orientation=landscape&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH}`
          }
        },
        12000
      );

      if (!res.ok) {
        continue;
      }

      const data = await res.json();

      if (!data || !data.urls || !data.urls.regular) {
        continue;
      }

      const imageUrl = data.urls.regular;
      const isValid = await validateImageUrl(imageUrl);
      if (!isValid) {
        continue;
      }

      return {
        url: imageUrl,
        alt: data.alt_description || keyword,
        author: data.user?.name || 'Unknown',
        isFallback: false,
        keyword
      };
    } catch {
      // Unsplash attempt failed
    }
  }

  return {
    url: `https://picsum.photos/1200/800?random=${Date.now()}`,
    alt: keyword,
    author: 'Picsum',
    isFallback: true,
    keyword
  };
}

export async function getHeroImage(keywords) {
  const primaryKeyword = keywords[0] || 'business';
  const secondaryKeyword = keywords[1] || 'office';
  
  const combinedQuery = `${primaryKeyword},${secondaryKeyword}`;
  
  try {
    const res = await fetchWithTimeout(
      `${UNSPLASH_BASE}?query=${encodeURIComponent(combinedQuery)}&orientation=landscape&content_filter=high`,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH}`
        }
      },
      15000
    );

    if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);

    const data = await res.json();

    if (!data || !data.urls || !data.urls.regular) {
      throw new Error('Invalid Unsplash response');
    }

    const imageUrl = data.urls.regular;
    const isValid = await validateImageUrl(imageUrl);
    if (!isValid) {
      throw new Error('Image URL validation failed');
    }

    return {
      url: imageUrl,
      alt: data.alt_description || `${primaryKeyword} ${secondaryKeyword}`,
      author: data.user?.name || 'Unknown',
      isFallback: false
    };
  } catch {
    return {
      url: `https://picsum.photos/1400/800?random=${Date.now()}`,
      alt: primaryKeyword,
      author: 'Picsum',
      isFallback: true
    };
  }
}

export async function getMultipleImages(keywords, count = 4) {
  const uniqueKeywords = [...new Set(keywords)].slice(0, count);
  const results = [];

  for (const kw of uniqueKeywords) {
      const img = await getImage(kw, 2);
      results.push(img);
  }
  
  return results;
}