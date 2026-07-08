"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PRESETS = [
  { label: "3", min: 3, max: 3 },
  { label: "4", min: 4, max: 4 },
  { label: "3-5", min: 3, max: 5 },
  { label: "3-6", min: 3, max: 6 },
  { label: "3-7", min: 3, max: 7 },
  { label: "3-8", min: 3, max: 8 },
  { label: "ALL", min: 2, max: 15 },
];

const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("");

function WordChip({ word, rank }) {
  const [copied, setCopied] = useState(false);
  const tap = () => {
    navigator.clipboard?.writeText(word).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    });
  };
  return (
    <button
      onClick={tap}
      className={[
        "inline-flex items-center justify-center rounded px-2 py-1",
        "font-mono text-xs font-semibold uppercase tracking-wide",
        "active:scale-95 transition-all select-none",
        rank < 5
          ? "bg-gold text-ink shadow-[0_2px_0_#8a6510]"
          : "bg-tile-face text-ink shadow-[0_2px_0_var(--wood-dark)]",
        copied ? "opacity-40" : "",
      ].join(" ")}
    >
      {copied ? "✓" : word}
    </button>
  );
}

function GroupSection({ length, words, truncated }) {
  const [expanded, setExpanded] = useState(false);
  const SHOW = 20;
  const visible = expanded ? words : words.slice(0, SHOW);
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
          {length}L
        </span>
        <span className="text-[10px] text-cream-dim font-mono">
          {words.length}{truncated ? "+" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((word, i) => (
          <WordChip key={word} word={word} rank={i} />
        ))}
        {words.length > SHOW && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center px-2 py-1 rounded bg-board-panel-raised border border-cream/15 text-cream-dim text-[10px] font-mono active:opacity-70"
          >
            +{words.length - SHOW}
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
  const [showKeyboard, setShowKeyboard] = useState(true);
  const inputRef = useRef(null);

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

  const groups = data?.groups ?? [];
  const totalWords = data?.totalMatches ?? 0;

  return (
    <div className="min-h-screen bg-board flex flex-col text-cream">

      {/* ── TOP BAR: title + keyboard toggle ── */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-cream/10">
        <span className="font-display font-bold text-gold text-base tracking-tight">
          Rackwords
        </span>
        <div className="flex items-center gap-2">
          {letters && (
            <button
              onClick={() => { setLetters(""); setData(null); }}
              className="text-[10px] uppercase tracking-wide text-cream-dim active:text-gold px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setShowKeyboard(v => {
                // when turning keyboard off, focus the hidden input
                if (v) setTimeout(() => inputRef.current?.focus(), 50);
                return !v;
              });
            }}
            className={[
              "text-[10px] uppercase tracking-wide px-2 py-1 rounded border transition-colors",
              showKeyboard
                ? "border-gold text-gold"
                : "border-cream/20 text-cream-dim",
            ].join(" ")}
          >
            ⌨ {showKeyboard ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── LETTER TILES DISPLAY ── */}
      <div
        className="flex items-center flex-wrap gap-1 px-3 py-2 min-h-[2.8rem] border-b border-cream/10 cursor-text"
        onClick={() => !showKeyboard && inputRef.current?.focus()}
      >
        {/* Hidden native input — active when custom keyboard is OFF */}
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          value={letters}
          onChange={e => setLetters(e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20))}
          className="absolute opacity-0 w-0 h-0"
          style={{ pointerEvents: showKeyboard ? "none" : "auto" }}
        />
        {letters.length === 0 ? (
          <span className="text-cream-dim/50 text-xs italic">
            {showKeyboard ? "Tap letters below…" : "Tap here to type…"}
          </span>
        ) : (
          letters.split("").map((l, i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center w-7 h-7 rounded bg-tile-face text-ink font-display font-bold text-sm uppercase shadow-[0_2px_0_var(--wood-dark)]"
            >
              {l}
            </span>
          ))
        )}
      </div>

      {/* ── LEVEL PRESETS ── */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-b border-cream/10">
        {PRESETS.map(p => {
          const active = p.min === range.min && p.max === range.max;
          return (
            <button
              key={p.label}
              onClick={() => setRange({ min: p.min, max: p.max })}
              className={[
                "flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide transition-colors active:scale-95",
                active
                  ? "bg-gold text-ink"
                  : "bg-board-panel-raised text-cream-dim border border-cream/15",
              ].join(" ")}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!letters && (
          <p className="text-cream-dim/50 text-xs text-center py-4 italic">
            Add letters to find words
          </p>
        )}
        {loading && (
          <div className="flex gap-1 justify-center py-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}
        {!loading && letters && groups.length === 0 && (
          <p className="text-cream-dim text-xs text-center py-4">
            No words found — try a wider range
          </p>
        )}
        {!loading && groups.length > 0 && (
          <>
            <p className="text-[10px] text-cream-dim mb-2 font-mono">
              <span className="text-gold font-bold">{totalWords}</span> words · tap to copy
            </p>
            {groups.map(g => (
              <GroupSection key={g.length} {...g} />
            ))}
          </>
        )}
      </div>

      {/* ── CUSTOM KEYBOARD (toggleable) ── */}
      {showKeyboard && (
        <div className="border-t border-cream/10 bg-board-panel pb-safe">
          <div className="px-1.5 pt-1.5 pb-1 space-y-1">
            {[ALPHA.slice(0, 9), ALPHA.slice(9, 18), ALPHA.slice(18)].map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1">
                {row.map(l => (
                  <button
                    key={l}
                    onClick={() => addLetter(l)}
                    className="flex-1 max-w-[2.6rem] h-9 rounded bg-tile-face text-ink font-display font-bold text-sm uppercase shadow-[0_2px_0_var(--wood-dark)] active:shadow-none active:translate-y-[2px] transition-transform select-none"
                  >
                    {l}
                  </button>
                ))}
                {ri === 2 && (
                  <button
                    onClick={deleteLetter}
                    className="flex-1 max-w-[3.2rem] h-9 rounded bg-wood text-cream font-bold text-base shadow-[0_2px_0_var(--wood-dark)] active:shadow-none active:translate-y-[2px] transition-transform select-none"
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
