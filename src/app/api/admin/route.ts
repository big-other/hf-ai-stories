import { NextRequest, NextResponse } from "next/server";
import { getAllStories, approveStory, rejectStory } from "@/lib/stories";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const encoded = Buffer.from(`admin:${password}`).toString("base64");
  return authHeader === `Basic ${encoded}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stories = await getAllStories();
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const success = await approveStory(id);
      return NextResponse.json({ success });
    } else if (action === "reject") {
      const success = await rejectStory(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process action" },
      { status: 500 }
    );
  }
}
