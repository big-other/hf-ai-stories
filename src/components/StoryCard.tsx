"use client";

import { useState, useCallback } from "react";
import { Story, STORY_EXCERPT_LENGTH } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  Employment: "bg-accent/10 text-accent-dark",
  "Creative work": "bg-purple-100 text-purple-700",
  Education: "bg-blue-100 text-blue-700",
  Healthcare: "bg-rose-100 text-rose-700",
  Privacy: "bg-amber-100 text-amber-700",
  Other: "bg-stone/20 text-dark-mid",
};

interface Props {
  story: Story;
  onExpand: (story: Story) => void;
}

export default function StoryCard({ story, onExpand }: Props) {
  const [upvotes, setUpvotes] = useState(story.upvotes);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === "undefined") return false;
    const voted = localStorage.getItem(`voted:${story.id}`);
    return voted === "true";
  });
  const [bouncing, setBouncing] = useState(false);

  const isLong = story.text.length > STORY_EXCERPT_LENGTH;
  const excerpt = isLong
    ? story.text.slice(0, STORY_EXCERPT_LENGTH).trim() + "..."
    : story.text;

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasVoted) return;

      setBouncing(true);
      setTimeout(() => setBouncing(false), 400);

      try {
        const res = await fetch("/api/upvote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: story.id }),
        });

        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
          setHasVoted(true);
          localStorage.setItem(`voted:${story.id}`, "true");
        }
      } catch {
        // Silently fail
      }
    },
    [hasVoted, story.id]
  );

  const date = new Date(story.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const colorClass = CATEGORY_COLORS[story.category] || CATEGORY_COLORS.Other;

  return (
    <article
      className="bg-white rounded-xl border border-stone/50 p-5 hover:border-stone hover:shadow-sm transition-all duration-200 cursor-pointer group"
      onClick={() => onExpand(story)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass}`}
        >
          {story.category}
        </span>
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-all duration-200 ${
            hasVoted
              ? "text-danger bg-danger-light"
              : "text-muted hover:text-danger hover:bg-danger-light/50"
          }`}
          aria-label={hasVoted ? "Already upvoted" : "Upvote this story"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={hasVoted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={bouncing ? "animate-heart-bounce" : ""}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="font-medium text-xs">{upvotes}</span>
        </button>
      </div>

      <p className="text-sm text-dark-warm leading-relaxed mb-4">{excerpt}</p>

      {isLong && (
        <span className="text-xs text-accent font-medium group-hover:text-accent-dark transition-colors duration-200">
          Read more &rarr;
        </span>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone/30">
        <span className="text-sm font-medium text-dark-mid">
          {story.name || "Anonymous"}
        </span>
        {story.location && (
          <>
            <span className="text-stone">&middot;</span>
            <span className="text-xs text-muted">{story.location}</span>
          </>
        )}
        <span className="text-stone">&middot;</span>
        <span className="text-xs text-muted">{date}</span>
      </div>
    </article>
  );
}
