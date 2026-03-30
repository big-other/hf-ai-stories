"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";
import StoryBoard from "@/components/StoryBoard";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

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
      </section>

      <div className="w-12 h-px bg-stone mx-auto mb-12" />

      {/* Submit form */}
      <section id="submit" className="max-w-xl mx-auto mb-16 scroll-mt-20">
        <h2 className="font-serif text-2xl text-dark-warm mb-2 text-center">
          Share Your Story
        </h2>
        <p className="text-sm text-muted text-center mb-6">
          Your experience matters. Stories can be anonymous and will be visible
          to everyone after a brief review.
        </p>
        <SubmitForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
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
        <StoryBoard refreshKey={refreshKey} />
      </section>
    </div>
  );
}
