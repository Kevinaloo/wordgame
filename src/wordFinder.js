import wordsByLength from "@/data/words-by-length.json";

export const MIN_SUPPORTED_LENGTH = 2;
export const MAX_SUPPORTED_LENGTH = 15;

// Per-length-group cap so a huge rack (e.g. 12+ letters) can't blow up the
// response. Groups are already sorted most-popular-first, so capping just
// trims the long tail of obscure words, not the good stuff.
const MAX_RESULTS_PER_LENGTH = 300;

function countLetters(str) {
  const counts = new Array(26).fill(0);
  for (const ch of str) {
    const code = ch.charCodeAt(0) - 97; // 'a' = 97
    if (code >= 0 && code < 26) counts[code]++;
  }
  return counts;
}

function fitsWithinRack(word, rackCounts) {
  // Copy so we don't mutate the shared rack counts between words.
  const remaining = rackCounts.slice();
  for (const ch of word) {
    const code = ch.charCodeAt(0) - 97;
    if (code < 0 || code >= 26) return false;
    if (remaining[code] <= 0) return false;
    remaining[code]--;
  }
  return true;
}

/**
 * Find every dictionary word that can be built from the given letters
 * (each letter usable only as many times as it appears), within a length
 * range, grouped by length and ordered most-popular-first within each group.
 *
 * @param {string} letters - the available letters, e.g. "trapes"
 * @param {number} minLength
 * @param {number} maxLength
 */
export function findWords(letters, minLength, maxLength) {
  const cleanLetters = String(letters || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const rackCounts = countLetters(cleanLetters);
  const rackSize = cleanLetters.length;

  let min = Math.max(MIN_SUPPORTED_LENGTH, Math.floor(minLength) || MIN_SUPPORTED_LENGTH);
  let max = Math.min(MAX_SUPPORTED_LENGTH, Math.floor(maxLength) || MAX_SUPPORTED_LENGTH);
  if (min > max) [min, max] = [max, min];
  // Can't form a word longer than the number of tiles available.
  max = Math.min(max, rackSize || MAX_SUPPORTED_LENGTH);

  const groups = [];
  let totalMatches = 0;

  if (rackSize > 0) {
    for (let length = min; length <= max; length++) {
      const candidates = wordsByLength[String(length)] || [];
      const matches = [];
      let truncated = false;
      for (const word of candidates) {
        if (fitsWithinRack(word, rackCounts)) {
          if (matches.length >= MAX_RESULTS_PER_LENGTH) {
            truncated = true;
            break;
          }
          matches.push(word);
        }
      }
      if (matches.length > 0) {
        totalMatches += matches.length;
        groups.push({ length, words: matches, truncated });
      }
    }
  }

  return {
    letters: cleanLetters,
    minLength: min,
    maxLength: max,
    totalMatches,
    groups,
  };
}
