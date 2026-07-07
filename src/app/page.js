"use client";

import { useEffect, useState } from "react";
import LetterRack from "@/components/LetterRack";
import LengthRange from "@/components/LengthRange";
import ResultsBoard from "@/components/ResultsBoard";

export default function Home() {
  const [letters, setLetters] = useState("");
  const [range, setRange] = useState({ min: 3, max: 6 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!letters) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      const params = new URLSearchParams({
        letters,
        min: String(range.min),
        max: String(range.max),
      });

      fetch(`/api/words?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            setError(json.error);
            setData(null);
          } else {
            setData(json);
          }
        })
        .catch(() => setError("Something went wrong finding words. Try again."))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [letters, range]);

  return (
    <main className="flex-1 bg-board">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal mb-3">
            Letter tile helper
          </p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-cream leading-[1.05] mb-4">
            Turn your rack into
            <br />
            <span className="italic text-gold">real words.</span>
          </h1>
          <p className="text-cream-dim max-w-xl leading-relaxed">
            Enter the letters you have, set the word-length range for your
            level, and get every valid word you can build — most common
            words first, grouped by length.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <LetterRack value={letters} onChange={setLetters} />
          <LengthRange
            min={range.min}
            max={range.max}
            onChange={setRange}
          />
        </div>

        <ResultsBoard
          groups={data?.groups}
          totalMatches={data?.totalMatches}
          loading={loading}
          error={error}
          hasLetters={Boolean(letters)}
        />

        <footer className="mt-16 pt-6 border-t border-cream/10 text-xs text-cream-dim/60">
          Dictionary of ~270,000 English words, ranked by real-world usage
          frequency. Each letter tile can only be used as many times as it
          appears in your rack.
        </footer>
      </div>
    </main>
  );
}
