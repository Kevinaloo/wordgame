"use client";

import { useEffect, useState } from "react";
import Tile from "./Tile";

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function LetterRack({ value, onChange }) {
  const [order, setOrder] = useState([]);

  // Keep the visual tile order in sync with the typed value, appending new
  // letters at the end rather than re-shuffling on every keystroke.
  useEffect(() => {
    setOrder((prev) => {
      const letters = value.split("");
      if (letters.length !== prev.length) return letters;
      return prev;
    });
  }, [value]);

  return (
    <div className="rounded-2xl bg-wood p-4 sm:p-5 shadow-[0_8px_0_var(--wood-dark),0_14px_24px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor="letters"
          className="text-xs uppercase tracking-[0.18em] text-cream/70 font-medium"
        >
          Your letters
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrder((prev) => shuffle(prev))}
            className="text-xs uppercase tracking-wide text-cream/70 hover:text-gold transition-colors"
          >
            Shuffle
          </button>
          <span className="text-cream/30">·</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs uppercase tracking-wide text-cream/70 hover:text-gold transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="min-h-[3.5rem] flex flex-wrap gap-2 mb-4">
        {order.length === 0 && (
          <p className="text-cream-dim text-sm italic py-3">
            Type your letters below — they&apos;ll show up here as tiles.
          </p>
        )}
        {order.map((letter, i) => (
          <Tile key={i} letter={letter} size="lg" />
        ))}
      </div>

      <input
        id="letters"
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20))
        }
        placeholder="e.g. trapes"
        className="w-full rounded-lg bg-board-panel/60 border border-cream/10 px-3 py-2 text-cream placeholder:text-cream-dim/60 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-gold/70"
      />
    </div>
  );
}
