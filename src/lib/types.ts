export interface Story {
  id: string;
  name: string;
  location: string;
  text: string;
  category: Category;
  approved: boolean;
  upvotes: number;
  createdAt: string;
}

export type Category =
  | "Employment"
  | "Creative work"
  | "Education"
  | "Healthcare"
  | "Privacy"
  | "Other";

export const CATEGORIES: Category[] = [
  "Employment",
  "Creative work",
  "Education",
  "Healthcare",
  "Privacy",
  "Other",
];

export const STORY_MAX_CHARS = 1500;
export const STORY_EXCERPT_LENGTH = 200;
export const STORIES_PER_PAGE = 12;
