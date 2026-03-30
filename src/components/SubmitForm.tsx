"use client";

import { useState } from "react";
import { CATEGORIES, STORY_MAX_CHARS } from "@/lib/types";

interface Props {
  onSubmitted: () => void;
}

export default function SubmitForm({ onSubmitted }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const charsLeft = STORY_MAX_CHARS - text.length;
  const canSubmit =
    text.trim().length > 0 && acknowledged && !submitting && charsLeft >= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          location: location.trim() || undefined,
          text: text.trim(),
          category: category || undefined,
          honeypot,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setName("");
      setLocation("");
      setText("");
      setCategory("");
      setAcknowledged(false);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-stone/50 p-8 text-center animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-dark-warm mb-2">
          Thank you for sharing
        </h3>
        <p className="text-muted text-sm mb-4">
          Your story will appear on the board after a brief review.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm text-accent hover:text-accent-dark underline underline-offset-2 transition-colors duration-200"
        >
          Submit another story
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-stone/50 p-6 sm:p-8 animate-fade-in-up"
    >
      {/* Honeypot — hidden from real users */}
      <div className="ohnohoney">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone uppercase tracking-widest mb-1.5">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-3 py-2.5 text-sm bg-paper border border-stone/50 rounded-lg text-dark-warm placeholder:text-stone transition-all duration-200 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(26,122,109,0.1)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone uppercase tracking-widest mb-1.5">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="w-full px-3 py-2.5 text-sm bg-paper border border-stone/50 rounded-lg text-dark-warm placeholder:text-stone transition-all duration-200 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(26,122,109,0.1)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone uppercase tracking-widest mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-paper border border-stone/50 rounded-lg text-dark-warm transition-all duration-200 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(26,122,109,0.1)]"
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone uppercase tracking-widest mb-1.5">
            Your Story
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={STORY_MAX_CHARS}
            placeholder="How has AI affected your life, work, or community?"
            className="w-full px-3 py-2.5 text-sm bg-paper border border-stone/50 rounded-lg text-dark-warm placeholder:text-stone transition-all duration-200 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(26,122,109,0.1)] resize-y"
          />
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${
                charsLeft < 100
                  ? charsLeft < 0
                    ? "text-danger font-medium"
                    : "text-danger"
                  : "text-muted"
              }`}
            >
              {charsLeft} characters remaining
            </span>
          </div>
        </div>

        {/* Public notice */}
        <div className="bg-linen/60 border border-stone/40 rounded-lg p-4">
          <p className="text-sm text-dark-mid leading-relaxed mb-3">
            Your story will be{" "}
            <strong className="text-dark-warm">shared publicly</strong> on our
            community board. Do not include personal information you wouldn&apos;t
            want others to see.
          </p>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-stone/60 text-accent focus:ring-accent/30 accent-accent"
            />
            <span className="text-sm text-dark-mid group-hover:text-dark-warm transition-colors duration-200">
              I understand my story will be publicly visible
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-6 py-3 transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
        >
          {submitting ? "Submitting..." : "Share Your Story"}
        </button>
      </div>
    </form>
  );
}
