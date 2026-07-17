export type Platform = "youtube" | "drive" | "instagram" | "direct" | "unknown";

export interface ParsedMedia {
  platform: Platform;
  embedUrl: string;
  thumbnailUrl: string;
  rawUrl: string;
  videoId?: string;
}

export function parseMediaUrl(url: string): ParsedMedia {
  const raw = url.trim();

  // ── YouTube ──────────────────────────────────────────────────
  // Formats: watch?v=ID | youtu.be/ID | shorts/ID | embed/ID
  const ytRegex =
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = raw.match(ytRegex);
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      platform: "youtube",
      videoId: id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      rawUrl: raw,
    };
  }

  // ── Google Drive ─────────────────────────────────────────────
  // Formats: /file/d/ID/view | /file/d/ID/edit | uc?id=ID
  const driveFileRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveMatch = raw.match(driveFileRegex);
  if (driveMatch) {
    const id = driveMatch[1];
    return {
      platform: "drive",
      videoId: id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
      rawUrl: raw,
    };
  }
  // Drive shared folder
  const driveFolderRegex = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
  const driveFolderMatch = raw.match(driveFolderRegex);
  if (driveFolderMatch) {
    const id = driveFolderMatch[1];
    return {
      platform: "drive",
      videoId: id,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${id}`,
      thumbnailUrl: "",
      rawUrl: raw,
    };
  }

  // ── Instagram ────────────────────────────────────────────────
  // Formats: /reel/ID/ | /p/ID/
  const igRegex = /instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/;
  const igMatch = raw.match(igRegex);
  if (igMatch) {
    const id = igMatch[1];
    return {
      platform: "instagram",
      videoId: id,
      embedUrl: `https://www.instagram.com/reel/${id}/embed/`,
      thumbnailUrl: "",
      rawUrl: raw,
    };
  }

  // ── Direct video URL (MP4, webm, etc.) ───────────────────────
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(raw)) {
    return {
      platform: "direct",
      embedUrl: raw,
      thumbnailUrl: "",
      rawUrl: raw,
    };
  }

  return { platform: "unknown", embedUrl: raw, thumbnailUrl: "", rawUrl: raw };
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    youtube: "YouTube",
    drive: "Google Drive",
    instagram: "Instagram",
    direct: "Direct Video",
    unknown: "Unknown",
  };
  return labels[platform];
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    youtube: "#ff0000",
    drive: "#4285f4",
    instagram: "#e1306c",
    direct: "#e63946",
    unknown: "#888",
  };
  return colors[platform];
}
