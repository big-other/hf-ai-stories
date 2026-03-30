"use client";

import { useEffect, useCallback, useState } from "react";
import { Story } from "@/lib/types";

interface Props {
  story: Story | null;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: Props) {
  const [upvotes, setUpvotes] = useState(story?.upvotes ?? 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (story) {
      setUpvotes(story.upvotes);
      setHasVoted(localStorage.getItem(`voted:${story.id}`) === "true");
    }
  }, [story]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (story) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }
  }, [story, handleEsc]);

  if (!story) return null;

  const date = new Date(story.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function handleUpvote() {
    if (hasVoted) return;

    setUpvotes((v) => v + 1);
    setHasVoted(true);
    localStorage.setItem(`voted:${story!.id}`, "true");
    setBouncing(true);
    setTimeout(() => setBouncing(false), 500);

    try {
      const res = await fetch("/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: story!.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
      }
    } catch {
      // Optimistic update stands
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop — softly blurred board behind */}
      <div
        className="absolute inset-0 bg-dark-warm/25 backdrop-blur-md"
        style={{ animation: "fadeInUp 0.15s ease-out both" }}
      />

      {/* The "picked up" card */}
      <div
        className="relative bg-[#FFFEF7] max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in"
        style={{
          borderRadius: "2px",
          boxShadow:
            "0 25px 60px -12px rgba(44,35,28,0.25), 0 12px 24px -8px rgba(44,35,28,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top edge — like a folded card */}
        <div className="h-1 bg-gradient-to-r from-stone/10 via-stone/20 to-stone/10" />

        <div className="px-7 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full text-stone/60 hover:text-dark-warm hover:bg-stone/10 transition-all duration-200"
            aria-label="Close"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>

          {/* Category + date — small, stamped feel */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-bold text-muted/60 uppercase tracking-[0.15em]">
              {story.category}
            </span>
            <span className="text-[10px] text-stone">&bull;</span>
            <span className="text-[10px] text-stone">{date}</span>
          </div>

          {/* Large opening quote */}
          <div className="font-serif text-6xl text-stone/25 leading-none select-none -mb-6 -ml-1">
            &ldquo;
          </div>

          {/* Full story */}
          <div className="font-serif text-xl sm:text-[22px] text-dark-warm leading-relaxed italic whitespace-pre-line">
            {story.text}
          </div>

          {/* Closing quote */}
          <div className="font-serif text-6xl text-stone/25 leading-none select-none text-right -mt-4 -mr-1">
            &rdquo;
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-stone/30 my-6" />

          {/* Author + upvote */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold text-dark-warm uppercase tracking-wide">
                {story.name || "Anonymous"}
              </p>
              {story.location && (
                <p className="text-[11px] text-muted mt-1">{story.location}</p>
              )}
            </div>

            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                hasVoted
                  ? "text-danger bg-danger-light/50"
                  : "text-stone/40 hover:text-danger hover:bg-danger-light/30"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={hasVoted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={bouncing ? "animate-heart-bounce" : ""}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-sm font-medium tabular-nums">{upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
