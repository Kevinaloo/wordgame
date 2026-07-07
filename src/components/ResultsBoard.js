"use client";

function WordChip({ word, rank }) {
  const isTop = rank < 3;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-sm uppercase tracking-wide",
        "bg-tile-face text-ink shadow-[0_2px_0_var(--wood-dark)]",
      ].join(" ")}
    >
      {isTop && <span className="text-gold-dim text-[10px]">&#9733;</span>}
      {word}
    </span>
  );
}

function LengthGroup({ length, words, truncated }) {
  return (
    <div className="rounded-xl bg-board-panel-raised border border-cream/5 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display font-semibold text-cream text-lg">
          {length}-letter words
        </h3>
        <span className="font-mono text-xs text-cream-dim">
          {words.length}
          {truncated ? "+" : ""} found
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((word, i) => (
          <WordChip key={word} word={word} rank={i} />
        ))}
      </div>
      {truncated && (
        <p className="text-xs text-cream-dim/70 mt-3 italic">
          Showing the {words.length} most common {length}-letter matches.
        </p>
      )}
    </div>
  );
}

export default function ResultsBoard({ groups, totalMatches, loading, error, hasLetters }) {
  if (!hasLetters) {
    return (
      <div className="rounded-xl border border-dashed border-cream/15 p-10 text-center">
        <p className="text-cream-dim">
          Add letters above to see every word you can make, sorted by how
          common each one is.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-cream/10 p-10 text-center">
        <p className="text-cream-dim animate-pulse">Dealing tiles…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-cream/10 p-10 text-center">
        <p className="text-cream-dim">{error}</p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="rounded-xl border border-cream/10 p-10 text-center">
        <p className="text-cream-dim">
          No words in that length range can be made from those letters. Try
          widening the range or adding tiles.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-cream-dim text-sm mb-4">
        <span className="text-gold font-mono">{totalMatches}</span> word
        {totalMatches === 1 ? "" : "s"} found, grouped by length, most common
        first.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <LengthGroup key={group.length} {...group} />
        ))}
      </div>
    </div>
  );
}
