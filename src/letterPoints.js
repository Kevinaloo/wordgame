// Standard English Scrabble letter point values.
// Used purely for the tile "point value" badge shown in the UI.
export const LETTER_POINTS = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

export function wordScore(word) {
  let total = 0;
  for (const ch of word) total += LETTER_POINTS[ch] || 0;
  return total;
}
