"use client";

import { LETTER_POINTS } from "@/lib/letterPoints";

const SIZE_CLASSES = {
  lg: "w-12 h-12 text-xl rounded-[6px]",
  md: "w-9 h-9 text-base rounded-[5px]",
  sm: "w-7 h-7 text-sm rounded-[4px]",
};

export default function Tile({
  letter,
  size = "lg",
  interactive = false,
  onClick,
  title,
}) {
  const point = LETTER_POINTS[letter?.toLowerCase()] || 0;
  const Wrapper = interactive ? "button" : "div";

  return (
    <Wrapper
      type={interactive ? "button" : undefined}
      onClick={onClick}
      title={title}
      className={[
        "relative inline-flex items-center justify-center select-none",
        "bg-tile-face text-ink font-display font-semibold uppercase",
        "shadow-[0_2px_0_var(--wood-dark),0_3px_4px_rgba(0,0,0,0.45)]",
        "border border-[color:var(--wood)]/40",
        SIZE_CLASSES[size],
        interactive
          ? "transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          : "",
      ].join(" ")}
    >
      {letter}
      {size !== "sm" && point > 0 && (
        <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-normal leading-none text-ink/60">
          {point}
        </span>
      )}
    </Wrapper>
  );
}
