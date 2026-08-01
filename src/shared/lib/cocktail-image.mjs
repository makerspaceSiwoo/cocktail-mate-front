const CANONICAL_COCKTAIL_IMAGE =
  /^(https:\/\/api\.cocktail-mate\.com\/media\/cocktails\/\d+-[a-f0-9]{12})\.webp$/;

/**
 * Return the pre-generated 128x96 sibling for canonical Cocktail Mate images.
 * Legacy and external URLs are returned unchanged.
 *
 * @param {string} imageUrl
 * @returns {string}
 */
export function getCocktailThumbnailUrl(imageUrl) {
  const match = CANONICAL_COCKTAIL_IMAGE.exec(imageUrl);
  return match ? `${match[1]}-thumb.webp` : imageUrl;
}
