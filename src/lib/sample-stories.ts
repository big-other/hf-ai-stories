import { Story } from "./types";

export const SAMPLE_STORIES: Story[] = [
  {
    id: "sample-1",
    name: "Maria G.",
    location: "Austin, TX",
    text: "I worked as a freelance translator for 12 years. Last year, three of my biggest clients told me they were switching to AI translation tools. I went from a comfortable living to scrambling for work in a matter of months. The hardest part isn't the money — it's that I spent years mastering two languages, understanding cultural nuance, and now a machine does a 'good enough' version for free. I'm retraining as a medical interpreter now, but I worry that's on borrowed time too.",
    category: "Employment",
    approved: true,
    upvotes: 47,
    createdAt: "2026-02-14T10:30:00.000Z",
  },
  {
    id: "sample-2",
    name: "Anonymous",
    location: "Chicago, IL",
    text: "My 14-year-old daughter's school started using an AI system to flag students 'at risk of falling behind.' She got flagged because she missed a week of school when her grandmother died. Now she's been pulled into a remedial track and we can't get a straight answer about what data the algorithm used or how to appeal. She feels labeled. I feel powerless.",
    category: "Education",
    approved: true,
    upvotes: 83,
    createdAt: "2026-01-22T14:15:00.000Z",
  },
  {
    id: "sample-3",
    name: "David Chen",
    location: "Portland, OR",
    text: "I'm a painter. Not a famous one, just someone who's made a living doing commissions and selling at local galleries for 20 years. Last month a client sent me an AI-generated image and asked me to 'just paint this on canvas.' They wanted my hands to execute a machine's vision — for a quarter of my usual rate. I said no, but I know plenty of artists who can't afford to.",
    category: "Creative work",
    approved: true,
    upvotes: 61,
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "sample-4",
    name: "Priya S.",
    location: "Seattle, WA",
    text: "After my mother was diagnosed with a rare autoimmune condition, I used an AI health tool to research treatment options. It surfaced a clinical trial at a university hospital two hours away that her doctors hadn't mentioned. She enrolled and it's been life-changing. I'm grateful for that. But it also scares me that access to this kind of information depends on knowing how to prompt an AI — my mom never would have found it on her own.",
    category: "Healthcare",
    approved: true,
    upvotes: 35,
    createdAt: "2026-03-10T16:45:00.000Z",
  },
];
