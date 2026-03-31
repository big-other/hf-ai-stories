import { NextRequest, NextResponse } from "next/server";
import { upvoteStory, downvoteStory } from "@/lib/stories";

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 });
    }

    const newCount = action === "remove"
      ? await downvoteStory(id)
      : await upvoteStory(id);

    if (newCount === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ upvotes: newCount });
  } catch {
    return NextResponse.json(
      { error: "Failed to upvote" },
      { status: 500 }
    );
  }
}
