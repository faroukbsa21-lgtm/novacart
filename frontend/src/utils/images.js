const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

/**
 * Safely extracts an array of valid image URL strings from any input format
 * (Array, JSON string, raw URL string, null, undefined)
 */
export function getProductImages(images) {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images
      .map(img => (typeof img === 'string' ? img.trim() : ''))
      .filter(Boolean);
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(img => (typeof img === 'string' ? img.trim() : '')).filter(Boolean);
        }
        if (parsed && typeof parsed === 'string') {
          return [parsed.trim()];
        }
      } catch (e) {
        // Not valid JSON, treat as raw single image URL
        return [trimmed];
      }
    }

    return [trimmed];
  }

  return [];
}

/**
 * Safely returns the primary/first image URL for a product
 */
export function getProductMainImage(images, fallback = DEFAULT_FALLBACK_IMAGE) {
  const list = getProductImages(images);
  return list[0] || fallback;
}
