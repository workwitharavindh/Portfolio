import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const configPath = path.join(process.cwd(), "src/data/config.json");
const SHEETS_URL = process.env.SHEETS_WEBAPP_URL ?? "";

// ── Helpers ──────────────────────────────────────────────────────────────────

function readLocalConfig() {
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}

function writeLocalConfig(data: unknown) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Thumbnail Auto-Resolution ─────────────────────────────────────────────────
// Strips any placeholder (Unsplash) thumbnails and auto-detects YouTube thumbnails
// from the videoUrl so the client always gets real thumbnails.

function resolveYouTubeThumbnail(videoUrl: string): string {
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = videoUrl?.match(ytRegex);
  if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  return "";
}

function cleanPortfolioItems(items: unknown[]): unknown[] {
  if (!Array.isArray(items)) return items;
  return items.map((item: unknown) => {
    const i = item as Record<string, unknown>;
    const thumb = typeof i.thumbnailUrl === "string" ? i.thumbnailUrl : "";
    const videoUrl = typeof i.videoUrl === "string" ? i.videoUrl : "";
    // Strip Unsplash placeholders — auto-resolve from YouTube instead
    const isUnsplash = thumb.includes("unsplash.com");
    const resolvedThumb = isUnsplash || thumb === ""
      ? resolveYouTubeThumbnail(videoUrl)
      : thumb;
    return { ...i, thumbnailUrl: resolvedThumb };
  });
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  // 1. Try Google Sheets first if URL is configured
  if (SHEETS_URL) {
    try {
      const res = await fetch(`${SHEETS_URL}?action=get`, {
        next: { revalidate: 30 }, // cache for 30s
      });
      if (res.ok) {
        const sheetsData = await res.json();
        // Merge sheets data over the local base config
        const base = readLocalConfig() ?? {};
        const merged = {
          ...base,
          ...sheetsData,
          categories: sheetsData.categories ?? base.categories ?? [],
          contactDetails: { ...(base.contactDetails ?? {}), ...(sheetsData.contactDetails ?? {}) },
          portfolioItems: cleanPortfolioItems(
            sheetsData.portfolioItems?.length
              ? sheetsData.portfolioItems
              : base.portfolioItems
          ),
        };
        return NextResponse.json(merged);
      }
    } catch (err) {
      console.warn("Sheets fetch failed, falling back to local config:", err);
    }
  }

  // 2. Fallback: local config.json
  const local = readLocalConfig();
  if (!local) return NextResponse.json({ error: "Config not found" }, { status: 404 });
  const cleaned = { ...local, portfolioItems: cleanPortfolioItems(local.portfolioItems ?? []) };
  return NextResponse.json(cleaned);
}


// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const newConfig = await request.json();
    if (!newConfig || typeof newConfig !== "object") {
      return NextResponse.json({ error: "Invalid configuration data" }, { status: 400 });
    }

    // 1. Always write to local config.json as backup
    writeLocalConfig(newConfig);

    // 2. If Sheets URL is configured, also push to Google Sheets
    if (SHEETS_URL) {
      try {
        const sheetsRes = await fetch(`${SHEETS_URL}?action=set`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newConfig),
        });
        if (!sheetsRes.ok) {
          console.warn("Google Sheets save warning:", await sheetsRes.text());
        }
      } catch (err) {
        console.warn("Failed to push to Sheets (local save succeeded):", err);
      }
    }

    return NextResponse.json({ success: true, message: "Configuration updated" });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
