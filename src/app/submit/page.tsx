"use client";

import SubmitForm from "@/components/SubmitForm";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <section className="max-w-xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-serif text-3xl sm:text-4xl text-dark-warm mb-3 leading-tight">
            Share Your Story
          </h1>
          <p className="text-muted text-base leading-relaxed">
            Your experience matters. Stories can be anonymous and will be visible
            to everyone after a brief review.
          </p>
        </div>
        <SubmitForm onSubmitted={() => router.push("/")} />
      </section>
    </div>
  );
}
