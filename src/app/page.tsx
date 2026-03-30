"use client";

import StoryBoard from "@/components/StoryBoard";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <h1 className="font-serif text-4xl sm:text-5xl text-dark-warm mb-4 leading-tight">
          How Has AI Affected You?
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto">
          Real stories from real people about how artificial intelligence is
          changing lives, jobs, and communities.
        </p>
        <p className="text-sm text-muted mt-3">
          These stories are shared openly to build awareness and accountability.
        </p>
        <a
          href="/submit"
          className="inline-block mt-6 bg-dark-warm hover:bg-dark-mid text-paper font-medium rounded-lg px-6 py-3 text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          Share Your Story
        </a>
      </section>

      <div className="w-12 h-px bg-stone mx-auto mb-12" />

      {/* Community board */}
      <section>
        <h2 className="font-serif text-2xl text-dark-warm mb-1 text-center">
          Community Stories
        </h2>
        <p className="text-sm text-muted text-center mb-8">
          Join hundreds of people sharing their experiences publicly
        </p>
        <StoryBoard refreshKey={0} />
      </section>
    </div>
  );
}
