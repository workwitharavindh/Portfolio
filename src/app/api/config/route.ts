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

function resolveDriveThumbnail(url: string): string {
  if (!url) return url;
  // Convert any drive.google.com/file/d/ID/... URL to a direct thumbnail link
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }
  // Also handle uc?id= format
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w800`;
  }
  return url;
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
      : resolveDriveThumbnail(thumb);  // Convert Drive share links to direct thumbnail URLs
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
          subcategories: sheetsData.subcategories ?? base.subcategories ?? [],
          contactDetails: { ...(base.contactDetails ?? {}), ...(sheetsData.contactDetails ?? {}) },
          aboutImageUrl: resolveDriveThumbnail(sheetsData.aboutImageUrl ?? base.aboutImageUrl ?? ""),
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
  const cleaned = {
    ...local,
    aboutImageUrl: resolveDriveThumbnail(local.aboutImageUrl ?? ""),
    portfolioItems: cleanPortfolioItems(local.portfolioItems ?? [])
  };
  return NextResponse.json(cleaned);
}


// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const newConfig = await request.json();
    if (!newConfig || typeof newConfig !== "object") {
      return NextResponse.json({ error: "Invalid configuration data" }, { status: 400 });
    }

    let localWriteSuccess = false;
    try {
      writeLocalConfig(newConfig);
      localWriteSuccess = true;
    } catch (err) {
      console.warn("Failed to write config to local filesystem (common on serverless hosts like Vercel):", err);
    }

    // 2. If Sheets URL is configured, also push to Google Sheets
    if (SHEETS_URL) {
      try {
        const sheetsRes = await fetch(`${SHEETS_URL}?action=set`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newConfig),
        });
        if (sheetsRes.ok) {
          return NextResponse.json({ success: true, message: "Configuration updated (saved to Google Sheets)" });
        } else {
          const errMsg = await sheetsRes.text();
          console.warn("Google Sheets save failed:", errMsg);
          if (!localWriteSuccess) {
            return NextResponse.json({ error: `Failed to save to Google Sheets: ${errMsg}` }, { status: 500 });
          }
        }
      } catch (err: any) {
        console.warn("Failed to push to Sheets:", err);
        if (!localWriteSuccess) {
          return NextResponse.json({ error: `Failed to connect to Google Sheets: ${err.message}` }, { status: 500 });
        }
      }
    }

    if (!localWriteSuccess && !SHEETS_URL) {
      return NextResponse.json({ 
        error: "Read-only file system. Please configure the SHEETS_WEBAPP_URL environment variable to enable cloud database saving." 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Configuration updated" });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
