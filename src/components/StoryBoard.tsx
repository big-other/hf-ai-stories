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

  const filtered = stories.filter((s) => (filter ? s.category === filter : true));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "upvotes") return b.upvotes - a.upvotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-stone/40 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              filter === ""
                ? "bg-dark-warm text-paper"
                : "bg-stone/20 text-muted hover:bg-stone/30"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                filter === cat
                  ? "bg-dark-warm text-paper"
                  : "bg-stone/20 text-muted hover:bg-stone/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="px-3 py-1.5 text-xs font-medium bg-paper border border-stone/50 rounded-lg text-dark-mid transition-all duration-200 focus:outline-none focus:border-accent/60"
        >
          <option value="upvotes">Most upvoted</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      {/* Stories grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-sm">
            {stories.length === 0
              ? "No stories yet. Be the first to share yours!"
              : "No stories match this filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="masonry stagger-children">
            {visible.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onExpand={setExpandedStory}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  setVisibleCount((c) => c + STORIES_PER_PAGE)
                }
                className="bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-6 py-2.5 text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                Load more stories
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
