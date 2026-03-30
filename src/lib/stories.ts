import { getRedis } from "./redis";
import { Story } from "./types";

const STORIES_KEY = "stories";
const STORY_PREFIX = "story:";

export async function createStory(
  story: Omit<Story, "id" | "approved" | "upvotes" | "createdAt">
): Promise<Story> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const newStory: Story = {
    ...story,
    id,
    approved: false,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  await redis.set(`${STORY_PREFIX}${id}`, JSON.stringify(newStory));
  await redis.lpush(STORIES_KEY, id);

  return newStory;
}

export async function getStory(id: string): Promise<Story | null> {
  const redis = getRedis();
  const data = await redis.get<string>(`${STORY_PREFIX}${id}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function getAllStories(): Promise<Story[]> {
  const redis = getRedis();
  const ids = await redis.lrange(STORIES_KEY, 0, -1);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.get(`${STORY_PREFIX}${id}`);
  }
  const results = await pipeline.exec();

  return results
    .filter(Boolean)
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r)) as Story[];
}

export async function getApprovedStories(): Promise<Story[]> {
  const all = await getAllStories();
  return all.filter((s) => s.approved);
}

export async function approveStory(id: string): Promise<boolean> {
  const redis = getRedis();
  const story = await getStory(id);
  if (!story) return false;
  story.approved = true;
  await redis.set(`${STORY_PREFIX}${id}`, JSON.stringify(story));
  return true;
}

export async function rejectStory(id: string): Promise<boolean> {
  const redis = getRedis();
  const story = await getStory(id);
  if (!story) return false;
  await redis.del(`${STORY_PREFIX}${id}`);
  await redis.lrem(STORIES_KEY, 1, id);
  return true;
}

export async function upvoteStory(id: string): Promise<number | null> {
  const redis = getRedis();
  const story = await getStory(id);
  if (!story || !story.approved) return null;
  story.upvotes += 1;
  await redis.set(`${STORY_PREFIX}${id}`, JSON.stringify(story));
  return story.upvotes;
}
