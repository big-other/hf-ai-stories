"use client";

import { useState, useEffect, useCallback } from "react";
import { Story, CATEGORIES, STORIES_PER_PAGE } from "@/lib/types";
import StoryCard from "./StoryCard";
import StoryModal from "./StoryModal";

type SortMode = "upvotes" | "newest";

interface Props {
  refreshKey: number;
}

export default function StoryBoard({ refreshKey }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<SortMode>("upvotes");
  const [visibleCount, setVisibleCount] = useState(STORIES_PER_PAGE);
  const [expandedStory, setExpandedStory] = useState<Story | null>(null);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories || []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories, refreshKey]);

  const filtered = stories.filter((s) =>
    filter ? s.category === filter : true
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "upvotes") return b.upvotes - a.upvotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-stone/40 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Controls — minimal, tucked above the board */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              filter === ""
                ? "bg-dark-warm text-paper"
                : "bg-stone/15 text-muted hover:bg-stone/25"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(filter === cat ? "" : cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                filter === cat
                  ? "bg-dark-warm text-paper"
                  : "bg-stone/15 text-muted hover:bg-stone/25"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="px-2.5 py-1 text-xs font-medium bg-transparent border border-stone/40 rounded-lg text-muted transition-all duration-200 focus:outline-none focus:border-accent/60"
        >
          <option value="upvotes">Most loved</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* The board */}
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-sm">
            {stories.length === 0
              ? "No stories yet. Be the first to share yours."
              : "No stories match this filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="pin-board">
            {visible.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                index={i}
                onExpand={setExpandedStory}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={() =>
                  setVisibleCount((c) => c + STORIES_PER_PAGE)
                }
                className="text-sm text-muted hover:text-dark-warm font-medium transition-colors duration-200 underline underline-offset-2 decoration-stone hover:decoration-dark-warm"
              >
                Show more stories
              </button>
            </div>
          )}
        </>
      )}

      <StoryModal
        story={expandedStory}
        onClose={() => setExpandedStory(null)}
      />
    </div>
  );
}
