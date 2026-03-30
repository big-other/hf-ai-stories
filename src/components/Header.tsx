"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-stone/60 bg-paper/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="https://humansfirst.com" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-dark-warm rounded-md flex items-center justify-center transition-colors duration-200 group-hover:bg-accent">
            <span className="text-paper text-xs font-bold tracking-tight font-sans">
              HF
            </span>
          </div>
          <span className="font-serif text-xl text-dark-warm">
            Humans First
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <a
            href="https://humansfirst.com"
            className="text-sm text-muted hover:text-dark-warm transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="https://humansfirst.com/ai-spending-data"
            className="text-sm text-muted hover:text-dark-warm transition-colors duration-200"
          >
            AI Spending Data
          </a>
          <a
            href="#submit"
            className="text-sm bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-4 py-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            Share Your Story
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-muted hover:text-dark-warm transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-stone/40 bg-paper/95 backdrop-blur-md animate-fade-in-up">
          <nav className="flex flex-col px-4 py-3 gap-3">
            <a
              href="https://humansfirst.com"
              className="text-sm text-muted hover:text-dark-warm transition-colors duration-200 py-1"
            >
              Home
            </a>
            <a
              href="https://humansfirst.com/ai-spending-data"
              className="text-sm text-muted hover:text-dark-warm transition-colors duration-200 py-1"
            >
              AI Spending Data
            </a>
            <a
              href="#submit"
              className="text-sm bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-4 py-2 text-center transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Share Your Story
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
