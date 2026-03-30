"use client";

import StoryBoard from "@/components/StoryBoard";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto px-4 pt-12 sm:pt-20 pb-10 animate-fade-in-up">
        <h1 className="font-serif text-4xl sm:text-5xl text-dark-warm mb-5 leading-[1.15]">
          How Has AI <em>Affected</em> You?
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md mx-auto">
          Real stories from real people about how artificial intelligence is
          changing lives, jobs, and communities.
        </p>
        <a
          href="/submit"
          className="inline-block mt-8 bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-6 py-3 text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          Share Your Story
        </a>
      </section>

      {/* Board */}
      <section id="board" className="max-w-4xl mx-auto px-4 pb-8 scroll-mt-16">
        <StoryBoard refreshKey={0} />
      </section>
    </div>
  );
}
