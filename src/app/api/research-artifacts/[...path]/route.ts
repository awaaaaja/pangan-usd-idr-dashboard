import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const ARTIFACT_ROOT = path.join(process.cwd(), "research-artifacts");

const CONTENT_TYPES: Record<string, string> = {
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const requested = params.path.join(path.sep);
  const resolved = path.resolve(ARTIFACT_ROOT, requested);

  if (!resolved.startsWith(ARTIFACT_ROOT + path.sep)) {
    return NextResponse.json({ error: "Invalid artifact path" }, { status: 400 });
  }

  try {
    const data = await fs.readFile(resolved);
    const extension = path.extname(resolved).toLowerCase();
    const headers = new Headers({
      "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    });

    if (extension !== ".png") {
      headers.set(
        "Content-Disposition",
        `attachment; filename="${path.basename(resolved)}"`,
      );
    }

    return new NextResponse(data, { headers });
  } catch {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }
}
