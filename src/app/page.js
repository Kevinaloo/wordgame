"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PRESETS = [
  { label: "L3", min: 3, max: 3 },
  { label: "L4", min: 4, max: 4 },
  { label: "L5", min: 3, max: 5 },
  { label: "L6", min: 3, max: 6 },
  { label: "L7", min: 3, max: 7 },
  { label: "L8", min: 3, max: 8 },
  { label: "ALL", min: 2, max: 15 },
];

const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("");

function WordChip({ word, rank }) {
  const [copied, setCopied] = useState(false);

  const handleTap = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(word).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 900);
      });
    }
  };

  return (
    <button
      onClick={handleTap}
      className={[
        "relative inline-flex items-center justify-center",
        "rounded-lg px-3 py-2 min-w-[3.5rem]",
        "font-mono text-sm font-semibold uppercase tracking-wide",
        "active:scale-95 transition-all select-none",
        rank < 5
          ? "bg-gold text-ink shadow-[0_3px_0_#8a6510]"
          : "bg-tile-face text-ink shadow-[0_3px_0_var(--wood-dark)]",
        copied ? "opacity-50" : "",
      ].join(" ")}
    >
      {copied ? "✓" : word}
    </button>
  );
}

function GroupSection({ length, words, truncated }) {
  const [expanded, setExpanded] = useState(false);
  const SHOW = 30;
  const visible = expanded ? words : words.slice(0, SHOW);
  const hasMore = words.length > SHOW;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
          {length} letters
        </span>
        <span className="text-xs text-cream-dim font-mono">
          ({words.length}{truncated ? "+" : ""})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {visible.map((word, i) => (
          <WordChip key={word} word={word} rank={i} />
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-board-panel-raised border border-cream/15 text-cream-dim text-sm font-mono active:opacity-70"
          >
            +{words.length - SHOW} more
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [letters, setLetters] = useState("");
  const [range, setRange] = useState({ min: 3, max: 6 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Fetch words whenever letters or range changes
  useEffect(() => {
    if (!letters) { setData(null); return; }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/words?letters=${encodeURIComponent(letters)}&min=${range.min}&max=${range.max}`)
        .then(r => r.json())
        .then(json => { setData(json); setLoading(false); })
        .catch(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [letters, range]);

  const addLetter = useCallback((l) => {
    setLetters(prev => prev.length < 20 ? prev + l : prev);
  }, []);

  const deleteLetter = useCallback(() => {
    setLetters(prev => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setLetters("");
    setData(null);
  }, []);

  const totalWords = data?.totalMatches ?? 0;
  const groups = data?.groups ?? [];

  return (
    <div className="min-h-screen bg-board flex flex-col">

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-board border-b border-cream/10 shadow-lg">

        {/* Title bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="font-display font-bold text-gold text-lg tracking-tight">
            Rackwords
          </span>
          {letters && (
            <button
              onClick={clearAll}
              className="text-xs text-cream-dim uppercase tracking-wide active:text-gold px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Letter display */}
        <div className="px-4 pb-2 min-h-[3rem] flex items-center gap-1.5 flex-wrap">
          {letters.length === 0 ? (
            <span className="text-cream-dim/50 text-sm italic">
              Tap letters below…
            </span>
          ) : (
            letters.split("").map((l, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-tile-face text-ink font-display font-bold text-lg uppercase shadow-[0_3px_0_var(--wood-dark)]"
              >
                {l}
              </span>
            ))
          )}
        </div>

        {/* Level presets */}
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
          {PRESETS.map(p => {
            const active = p.min === range.min && p.max === range.max;
            return (
              <button
                key={p.label}
                onClick={() => setRange({ min: p.min, max: p.max })}
                className={[
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wide transition-colors active:scale-95",
                  active
                    ? "bg-gold text-ink"
                    : "bg-board-panel-raised text-cream-dim border border-cream/15"
                ].join(" ")}
              >
                {p.label}
                <span className="ml-1 opacity-60 normal-case font-normal">
                  {p.min === p.max ? p.min : `${p.min}-${p.max}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {!letters && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="text-5xl">🔤</div>
            <p className="text-cream-dim text-sm max-w-xs leading-relaxed">
              Tap your available letters on the keyboard below. Words appear instantly, most common first.
            </p>
            <p className="text-cream-dim/50 text-xs">
              Tap any word to copy it
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 py-6 justify-center">
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {!loading && letters && groups.length === 0 && (
          <div className="text-center py-12 text-cream-dim text-sm">
            No words found for these letters in that range.
            <br />Try widening the level preset.
          </div>
        )}

        {!loading && groups.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gold font-mono font-bold">{totalWords}</span>
              <span className="text-cream-dim text-sm">words found · tap to copy</span>
            </div>
            {groups.map(g => (
              <GroupSection key={g.length} {...g} />
            ))}
          </>
        )}
      </div>

      {/* ── KEYBOARD ── */}
      <div className="sticky bottom-0 z-30 bg-board-panel border-t border-cream/10 pb-safe">
        <div className="px-2 pt-2 pb-1 space-y-1.5">
          {/* Row 1: a-i */}
          <div className="flex justify-center gap-1">
            {ALPHA.slice(0, 9).map(l => (
              <button
                key={l}
                onClick={() => addLetter(l)}
                className="flex-1 max-w-[2.8rem] h-11 rounded-lg bg-tile-face text-ink font-display font-bold text-base uppercase shadow-[0_3px_0_var(--wood-dark)] active:shadow-none active:translate-y-[3px] transition-transform select-none"
              >
                {l}
              </button>
            ))}
          </div>
          {/* Row 2: j-r */}
          <div className="flex justify-center gap-1">
            {ALPHA.slice(9, 18).map(l => (
              <button
                key={l}
                onClick={() => addLetter(l)}
                className="flex-1 max-w-[2.8rem] h-11 rounded-lg bg-tile-face text-ink font-display font-bold text-base uppercase shadow-[0_3px_0_var(--wood-dark)] active:shadow-none active:translate-y-[3px] transition-transform select-none"
              >
                {l}
              </button>
            ))}
          </div>
          {/* Row 3: s-z + delete */}
          <div className="flex justify-center gap-1">
            {ALPHA.slice(18).map(l => (
              <button
                key={l}
                onClick={() => addLetter(l)}
                className="flex-1 max-w-[2.8rem] h-11 rounded-lg bg-tile-face text-ink font-display font-bold text-base uppercase shadow-[0_3px_0_var(--wood-dark)] active:shadow-none active:translate-y-[3px] transition-transform select-none"
              >
                {l}
              </button>
            ))}
            <button
              onClick={deleteLetter}
              className="flex-1 max-w-[3.5rem] h-11 rounded-lg bg-wood text-cream font-bold text-lg shadow-[0_3px_0_var(--wood-dark)] active:shadow-none active:translate-y-[3px] transition-transform select-none"
            >
              ⌫
            </button>
          </div>
        </div>
        {/* Safe area spacer for phones with home bar */}
        <div className="h-2" />
      </div>
    </div>
  );
}
