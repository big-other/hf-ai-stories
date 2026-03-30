"use client";

import { useEffect, useCallback, useState } from "react";
import { Story } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  Employment: "bg-accent/10 text-accent-dark",
  "Creative work": "bg-purple-100 text-purple-700",
  Education: "bg-blue-100 text-blue-700",
  Healthcare: "bg-rose-100 text-rose-700",
  Privacy: "bg-amber-100 text-amber-700",
  Other: "bg-stone/20 text-dark-mid",
};

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

  const colorClass =
    CATEGORY_COLORS[story.category] || CATEGORY_COLORS.Other;

  async function handleUpvote() {
    if (hasVoted) return;

    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);

    try {
      const res = await fetch("/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: story!.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setHasVoted(true);
        localStorage.setItem(`voted:${story!.id}`, "true");
      }
    } catch {
      // Silently fail
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-warm/40 backdrop-blur-sm animate-fade-in-up" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl border border-stone/50 shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-dark-warm hover:bg-stone/20 transition-all duration-200"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4l8 8M12 4L4 12" />
            </svg>
          </button>

          {/* Category & date */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass}`}
            >
              {story.category}
            </span>
            <span className="text-xs text-muted">{date}</span>
          </div>

          {/* Story text */}
          <p className="text-base text-dark-warm leading-relaxed whitespace-pre-line">
            {story.text}
          </p>

          <div className="w-12 h-px bg-stone mx-auto my-6" />

          {/* Author & upvote */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-warm">
                {story.name || "Anonymous"}
              </p>
              {story.location && (
                <p className="text-xs text-muted mt-0.5">{story.location}</p>
              )}
            </div>
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                hasVoted
                  ? "text-danger bg-danger-light"
                  : "text-muted hover:text-danger hover:bg-danger-light/50"
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
              <span className="font-medium">{upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
