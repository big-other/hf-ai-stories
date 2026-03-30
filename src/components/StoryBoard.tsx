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
      <div className="flex justify-center py-24">
        <div className="w-6 h-6 border-2 border-stone/40 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Filters — floating above the board */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[{ label: "All", value: "" }, ...CATEGORIES.map((c) => ({ label: c, value: c }))].map(
            ({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(filter === value ? "" : value)}
                className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all duration-200 uppercase tracking-wide ${
                  filter === value
                    ? "bg-dark-warm text-paper shadow-sm"
                    : "bg-linen/80 text-muted hover:bg-linen hover:text-dark-mid"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="px-3 py-1 text-[11px] font-medium bg-linen/80 border-none rounded-full text-muted uppercase tracking-wide cursor-pointer focus:outline-none"
        >
          <option value="upvotes">Most loved</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Cork board surface */}
      {sorted.length === 0 ? (
        <div className="cork-board text-center py-24">
          <p className="text-muted text-sm relative z-10">
            {stories.length === 0
              ? "No stories yet. Be the first to share yours."
              : "No stories match this filter."}
          </p>
        </div>
      ) : (
        <div className="cork-board">
          <div className="pin-board relative z-10">
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
            <div className="flex justify-center pb-6 relative z-10">
              <button
                onClick={() =>
                  setVisibleCount((c) => c + STORIES_PER_PAGE)
                }
                className="text-xs text-muted hover:text-dark-warm font-medium transition-colors duration-200 underline underline-offset-2 decoration-stone/50 hover:decoration-dark-warm"
              >
                Show more stories
              </button>
            </div>
          )}
        </div>
      )}

      <StoryModal
        story={expandedStory}
        onClose={() => setExpandedStory(null)}
      />
    </div>
  );
}
