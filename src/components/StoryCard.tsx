"use client";

import { useState, useCallback, useMemo } from "react";
import { Story } from "@/lib/types";

const CATEGORY_DOT: Record<string, string> = {
  Employment: "bg-accent",
  "Creative work": "bg-purple-500",
  Education: "bg-blue-500",
  Healthcare: "bg-rose-500",
  Privacy: "bg-amber-500",
  Other: "bg-stone",
};

const PIN_COLORS = [
  "bg-danger",
  "bg-accent",
  "bg-amber-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-rose-500",
];

const EXCERPT_LENGTH = 100;

interface Props {
  story: Story;
  index: number;
  onExpand: (story: Story) => void;
}

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return ((hash & 0x7fffffff) % 1000) / 1000;
}

export default function StoryCard({ story, index, onExpand }: Props) {
  const [upvotes, setUpvotes] = useState(story.upvotes);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`voted:${story.id}`) === "true";
  });
  const [bouncing, setBouncing] = useState(false);

  // Deterministic "random" values from story id
  const cardStyle = useMemo(() => {
    const r = seededRandom(story.id);
    const rotation = (r - 0.5) * 4; // -2 to +2 degrees
    const pinColor = PIN_COLORS[Math.floor(seededRandom(story.id + "pin") * PIN_COLORS.length)];
    const pinOffset = 35 + seededRandom(story.id + "off") * 30; // 35-65% from left
    return { rotation, pinColor, pinOffset };
  }, [story.id]);

  const excerpt = useMemo(() => {
    if (story.text.length <= EXCERPT_LENGTH) return story.text;
    // Cut at last space before limit
    const cut = story.text.slice(0, EXCERPT_LENGTH);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "\u2026";
  }, [story.text]);

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasVoted) return;

      // Optimistic update
      setUpvotes((v) => v + 1);
      setHasVoted(true);
      localStorage.setItem(`voted:${story.id}`, "true");
      setBouncing(true);
      setTimeout(() => setBouncing(false), 450);

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

  const dotColor = CATEGORY_DOT[story.category] || CATEGORY_DOT.Other;

  return (
    <article
      className="pin-card bg-white rounded-lg cursor-pointer relative"
      style={{
        transform: `rotate(${cardStyle.rotation}deg)`,
        boxShadow:
          "0 1px 3px rgba(44,35,28,0.06), 0 4px 12px -2px rgba(44,35,28,0.08)",
        ["--card-rotate" as string]: `rotate(${cardStyle.rotation}deg)`,
        animationDelay: `${index * 50}ms`,
      }}
      onClick={() => onExpand(story)}
    >
      {/* Push pin */}
      <div
        className="absolute -top-1.5 z-10"
        style={{ left: `${cardStyle.pinOffset}%` }}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full ${cardStyle.pinColor} shadow-sm`}
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.3)",
          }}
        />
      </div>

      <div className="px-5 pt-5 pb-4">
        {/* Quote mark + excerpt */}
        <div className="mb-3">
          <span className="font-serif text-3xl text-stone/60 leading-none select-none">
            &ldquo;
          </span>
          <p className="text-sm text-dark-warm/85 leading-relaxed -mt-3 pl-1 font-light">
            {excerpt}
          </p>
        </div>

        {/* Footer: author, category dot, heart */}
        <div className="flex items-center justify-between pt-2 border-t border-stone/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className="text-xs text-muted truncate">
              {story.name || "Anonymous"}
              {story.location ? ` \u00b7 ${story.location}` : ""}
            </span>
          </div>

          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 pl-2 py-0.5 rounded-full text-xs transition-all duration-200 flex-shrink-0 ${
              hasVoted
                ? "text-danger"
                : "text-stone hover:text-danger"
            }`}
            aria-label={hasVoted ? "Already upvoted" : "Upvote this story"}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={hasVoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className={bouncing ? "animate-heart-bounce" : ""}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="font-medium tabular-nums">{upvotes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
