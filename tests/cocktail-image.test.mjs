import assert from "node:assert/strict";
import test from "node:test";

import { getCocktailThumbnailUrl } from "../src/shared/lib/cocktail-image.mjs";

test("derives a thumbnail for canonical hashed cocktail images", () => {
  const main = "https://api.cocktail-mate.com/media/cocktails/42-abcdef123456.webp";

  assert.equal(
    getCocktailThumbnailUrl(main),
    "https://api.cocktail-mate.com/media/cocktails/42-abcdef123456-thumb.webp",
  );
});

test("leaves external, legacy, queried, and existing thumbnail URLs unchanged", () => {
  const urls = [
    "https://example.com/cocktail.webp",
    "https://api.cocktail-mate.com/media/cocktails/42.webp",
    "https://api.cocktail-mate.com/media/cocktails/42-abcdef123456.webp?v=1",
    "https://api.cocktail-mate.com/media/cocktails/42-abcdef123456-thumb.webp",
    "",
  ];

  for (const url of urls) {
    assert.equal(getCocktailThumbnailUrl(url), url);
  }
});
