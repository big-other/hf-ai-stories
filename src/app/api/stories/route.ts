import { NextRequest, NextResponse } from "next/server";
import { createStory, getApprovedStories } from "@/lib/stories";
import { CATEGORIES, Category, STORY_MAX_CHARS } from "@/lib/types";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function GET() {
  try {
    const stories = await getApprovedStories();
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, location, text, category, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      // Bot detected — return success to not tip them off
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Story text is required" },
        { status: 400 }
      );
    }

    if (text.length > STORY_MAX_CHARS) {
      return NextResponse.json(
        { error: `Story must be under ${STORY_MAX_CHARS} characters` },
        { status: 400 }
      );
    }

    if (category && !CATEGORIES.includes(category as Category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const story = await createStory({
      name: typeof name === "string" && name.trim() ? name.trim() : "Anonymous",
      location: typeof location === "string" ? location.trim() : "",
      text: text.trim(),
      category: (category as Category) || "Other",
    });

    return NextResponse.json({ success: true, id: story.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit story" },
      { status: 500 }
    );
  }
}
