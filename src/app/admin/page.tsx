"use client";

import { useState, useCallback } from "react";
import { Story } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeader = `Basic ${btoa(`admin:${password}`)}`;

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: authHeader },
      });
      if (res.status === 401) {
        setError("Invalid password");
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStories(data.stories || []);
      setAuthenticated(true);
    } catch {
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        fetchStories();
      }
    } catch {
      setError("Action failed");
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="font-serif text-2xl text-dark-warm mb-6 text-center">
          Admin
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchStories();
          }}
          className="space-y-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-3 py-2.5 text-sm bg-paper border border-stone/50 rounded-lg text-dark-warm placeholder:text-stone transition-all duration-200 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(26,122,109,0.1)]"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-6 py-2.5 text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  const pending = stories.filter((s) => !s.approved);
  const approved = stories.filter((s) => s.approved);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-dark-warm">
          Story Moderation
        </h1>
        <button
          onClick={fetchStories}
          className="text-sm text-accent hover:text-accent-dark transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-sm text-danger mb-6">
          {error}
        </div>
      )}

      {/* Pending stories */}
      <section className="mb-10">
        <h2 className="text-xs font-medium text-stone uppercase tracking-widest mb-4">
          Pending Review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted py-4">No stories pending review.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((story) => (
              <AdminStoryCard
                key={story.id}
                story={story}
                onApprove={() => handleAction(story.id, "approve")}
                onReject={() => handleAction(story.id, "reject")}
              />
            ))}
          </div>
        )}
      </section>

      {/* Approved stories */}
      <section>
        <h2 className="text-xs font-medium text-stone uppercase tracking-widest mb-4">
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted py-4">No approved stories yet.</p>
        ) : (
          <div className="space-y-4">
            {approved.map((story) => (
              <AdminStoryCard
                key={story.id}
                story={story}
                onReject={() => handleAction(story.id, "reject")}
                approved
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminStoryCard({
  story,
  onApprove,
  onReject,
  approved,
}: {
  story: Story;
  onApprove?: () => void;
  onReject: () => void;
  approved?: boolean;
}) {
  const date = new Date(story.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-white rounded-xl border p-5 ${
        approved ? "border-stone/30" : "border-accent/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-2 text-xs text-muted">
        <span className="font-medium text-dark-mid">
          {story.name || "Anonymous"}
        </span>
        {story.location && (
          <>
            <span>&middot;</span>
            <span>{story.location}</span>
          </>
        )}
        <span>&middot;</span>
        <span>{story.category}</span>
        <span>&middot;</span>
        <span>{date}</span>
        <span>&middot;</span>
        <span>{story.upvotes} votes</span>
      </div>
      <p className="text-sm text-dark-warm leading-relaxed whitespace-pre-line mb-4">
        {story.text}
      </p>
      <div className="flex gap-2">
        {onApprove && (
          <button
            onClick={onApprove}
            className="px-4 py-1.5 text-xs font-medium bg-accent text-paper rounded-lg hover:bg-accent-dark transition-colors duration-200"
          >
            Approve
          </button>
        )}
        <button
          onClick={onReject}
          className="px-4 py-1.5 text-xs font-medium bg-danger-light text-danger rounded-lg hover:bg-danger/10 transition-colors duration-200"
        >
          {approved ? "Remove" : "Reject"}
        </button>
      </div>
    </div>
  );
}
