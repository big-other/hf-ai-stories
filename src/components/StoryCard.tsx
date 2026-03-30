"use client";

import { useState, useCallback, useMemo } from "react";
import { Story } from "@/lib/types";

// Warm-toned paper colors for variety
const PAPER_COLORS = [
  "bg-[#FFFEF7]",    // warm white
  "bg-[#FFF8ED]",    // cream
  "bg-[#F5F0E8]",    // oatmeal
  "bg-[#FFF5F5]",    // blush
  "bg-[#F0F7F4]",    // sage
  "bg-[#F5F3FF]",    // lavender
  "bg-[#FFFBEB]",    // butter
  "bg-[#FFF1E6]",    // peach
];

const TAPE_COLORS = [
  "bg-[#E8D5B7]",   // kraft
  "bg-[#B8D4CE]",   // seafoam
  "bg-[#D4B8B8]",   // dusty rose
  "bg-[#C5CCE0]",   // periwinkle
  "bg-[#D6CEB2]",   // sand
  "bg-[#C2D4B8]",   // moss
  "bg-[#E0CFC5]",   // nude
];

interface Props {
  story: Story;
  index: number;
  onExpand: (story: Story) => void;
}

// Deterministic pseudo-random from a string seed
function seed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return ((h & 0x7fffffff) % 10000) / 10000;
}

/**
 * Extracts the most "impactful" sentence from a story to use as a pull quote.
 * Prefers sentences with em dashes, strong emotion words, or first-person stakes.
 */
function extractPullQuote(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // Score each sentence
  const scored = sentences.map((s) => {
    let score = 0;
    const t = s.toLowerCase();
    // Emotional / high-impact signals
    if (t.includes("—")) score += 3;
    if (/\bi feel\b|\bscares me\b|\bhardest part\b|\bcried\b|\bpowerless\b/.test(t)) score += 4;
    if (/\bnobody\b|\bno one\b|\bcan't\b|\bwon't\b/.test(t)) score += 2;
    if (/\blife-changing\b|\bchanged\b|\blost\b|\bgone\b/.test(t)) score += 2;
    // Prefer mid-length sentences (not too short, not too long)
    if (s.length > 40 && s.length < 140) score += 2;
    if (s.length > 20 && s.length < 40) score += 1;
    // Prefer sentences that aren't the very first (which tend to be setup)
    if (sentences.indexOf(s) > 0) score += 1;
    return { sentence: s.trim(), score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.sentence || text.slice(0, 120);

  // Cap at ~120 chars for the card
  if (best.length > 130) {
    const cut = best.slice(0, 120);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "\u2026";
  }
  return best;
}

export default function StoryCard({ story, index, onExpand }: Props) {
  const [upvotes, setUpvotes] = useState(story.upvotes);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`voted:${story.id}`) === "true";
  });
  const [bouncing, setBouncing] = useState(false);

  const cardProps = useMemo(() => {
    const r1 = seed(story.id);
    const r2 = seed(story.id + "a");
    const r3 = seed(story.id + "b");
    const r4 = seed(story.id + "c");

    return {
      rotation: (r1 - 0.5) * 5, // -2.5 to +2.5 degrees
      paperColor: PAPER_COLORS[Math.floor(r2 * PAPER_COLORS.length)],
      tapeColor: TAPE_COLORS[Math.floor(r3 * TAPE_COLORS.length)],
      tapeOffset: 25 + r4 * 50, // 25-75% from left
      tapeRotation: (r1 - 0.5) * 12, // slight tape angle
    };
  }, [story.id]);

  const pullQuote = useMemo(() => extractPullQuote(story.text), [story.text]);

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasVoted) return;

      setUpvotes((v) => v + 1);
      setHasVoted(true);
      localStorage.setItem(`voted:${story.id}`, "true");
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);

      try {
        const res = await fetch("/api/upvote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: story.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
        }
      } catch {
        // Optimistic update stands
      }
    },
    [hasVoted, story.id]
  );

  return (
    <article
      className={`pin-card ${cardProps.paperColor} rounded-sm cursor-pointer relative overflow-visible`}
      style={{
        transform: `rotate(${cardProps.rotation}deg)`,
        boxShadow:
          "0 1px 2px rgba(44,35,28,0.05), 0 4px 16px -4px rgba(44,35,28,0.1)",
        ["--card-rotate" as string]: `rotate(${cardProps.rotation}deg)`,
        animationDelay: `${index * 70}ms`,
      }}
      onClick={() => onExpand(story)}
    >
      {/* Washi tape */}
      <div
        className={`washi-tape ${cardProps.tapeColor}`}
        style={{
          left: `${cardProps.tapeOffset}%`,
          transform: `translateX(-50%) rotate(${cardProps.tapeRotation}deg)`,
        }}
      />

      {/* Content */}
      <div className="px-5 pt-6 pb-5">
        {/* Pull quote */}
        <blockquote className="mb-4">
          <p className="font-serif text-[17px] sm:text-lg text-dark-warm leading-snug italic">
            &ldquo;{pullQuote}&rdquo;
          </p>
        </blockquote>

        {/* Author line + heart */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-dark-mid tracking-wide uppercase">
              {story.name || "Anonymous"}
            </p>
            {story.location && (
              <p className="text-[10px] text-muted mt-0.5">{story.location}</p>
            )}
          </div>

          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 flex-shrink-0 transition-all duration-200 ${
              hasVoted ? "text-danger" : "text-stone/50 hover:text-danger"
            }`}
            aria-label={hasVoted ? "Already upvoted" : "Upvote this story"}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={hasVoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className={bouncing ? "animate-heart-bounce" : ""}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[11px] font-medium tabular-nums">{upvotes}</span>
          </button>
        </div>
      </div>

      {/* Category stamp — faint, rotated in corner */}
      <div
        className="stamp font-sans text-dark-warm"
        style={{ transform: `rotate(-${6 + seed(story.id + "stamp") * 8}deg)` }}
      >
        {story.category}
      </div>
    </article>
  );
}
