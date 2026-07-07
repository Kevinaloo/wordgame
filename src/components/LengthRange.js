"use client";

const BOUNDS = { min: 2, max: 15 };

const PRESETS = [
  { label: "Easy", min: 3, max: 4 },
  { label: "Medium", min: 3, max: 6 },
  { label: "Hard", min: 3, max: 9 },
  { label: "Expert", min: 3, max: 12 },
];

export default function LengthRange({ min, max, onChange }) {
  const handleMinChange = (val) => {
    const next = Math.min(Number(val), max);
    onChange({ min: next, max });
  };
  const handleMaxChange = (val) => {
    const next = Math.max(Number(val), min);
    onChange({ min, max: next });
  };

  const pct = (v) => ((v - BOUNDS.min) / (BOUNDS.max - BOUNDS.min)) * 100;

  return (
    <div className="rounded-2xl bg-board-panel-raised p-4 sm:p-5 border border-cream/5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-[0.18em] text-cream/70 font-medium">
          Word length
        </span>
        <span className="font-mono text-gold text-sm">
          {min}–{max} letters
        </span>
      </div>

      <div className="range-slider my-3">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-gold/80"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded-full bg-cream/15" />
        <input
          type="range"
          min={BOUNDS.min}
          max={BOUNDS.max}
          value={min}
          onChange={(e) => handleMinChange(e.target.value)}
          aria-label="Minimum word length"
        />
        <input
          type="range"
          min={BOUNDS.min}
          max={BOUNDS.max}
          value={max}
          onChange={(e) => handleMaxChange(e.target.value)}
          aria-label="Maximum word length"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {PRESETS.map((preset) => {
          const active = preset.min === min && preset.max === max;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ min: preset.min, max: preset.max })}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border transition-colors",
                active
                  ? "bg-gold text-ink border-gold"
                  : "bg-transparent text-cream-dim border-cream/15 hover:border-gold/60 hover:text-cream",
              ].join(" ")}
            >
              {preset.label}{" "}
              <span className="font-mono normal-case tracking-normal opacity-70">
                {preset.min}–{preset.max}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
