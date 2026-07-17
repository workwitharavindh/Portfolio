import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { folderUrl, apiKey } = await request.json();

    if (!folderUrl) {
      return NextResponse.json({ error: "Folder URL is required" }, { status: 400 });
    }

    // Extract Folder ID
    // Example format: https://drive.google.com/drive/folders/1A2B3C4D5E6F...
    const folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
    const folderId = folderIdMatch ? folderIdMatch[1] : null;

    if (!folderId) {
      return NextResponse.json({ error: "Invalid Google Drive folder URL format" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        message: "Folder URL parsed. Add Google API Key to connect live Drive files. Using local fallback demo assets.",
        folderId,
        files: []
      });
    }

    // Call Google Drive API v3 to list files inside the folder
    const driveApiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,thumbnailLink,size)&key=${apiKey}`;

    const res = await fetch(driveApiUrl);
    if (!res.ok) {
      const errData = await res.json();
      return NextResponse.json({
        error: errData.error?.message || "Failed to fetch from Google Drive API",
        details: errData
      }, { status: res.status });
    }

    const data = await res.json();
    const driveFiles = data.files || [];

    // Map and categorize files
    const parsedItems = driveFiles.map((file: any) => {
      const isVideo = file.mimeType.startsWith("video/");
      const isImage = file.mimeType.startsWith("image/");
      
      // Auto-categorization: if file is named "Category - Title.mp4"
      let category = "Featured Work";
      let title = file.name.replace(/\.[^/.]+$/, ""); // strip extension
      
      if (title.includes(" - ")) {
        const parts = title.split(" - ");
        category = parts[0].trim();
        title = parts.slice(1).join(" - ").trim();
      } else if (isVideo) {
        category = "Video Content";
      } else if (isImage) {
        category = "Image Gallery";
      }

      const directLink = `https://lh3.googleusercontent.com/d/${file.id}`;
      
      return {
        id: file.id,
        title,
        category,
        videoUrl: isVideo ? directLink : "",
        thumbnailUrl: isImage ? directLink : (file.thumbnailLink || "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80"),
        description: `Synced from Google Drive: ${file.name}`,
        isFeatured: false,
        beforeVideoUrl: "",
        afterVideoUrl: ""
      };
    });

    return NextResponse.json({
      success: true,
      folderId,
      message: `Successfully loaded ${parsedItems.length} assets from Google Drive.`,
      files: parsedItems
    });
  } catch (error: any) {
    console.error("Error fetching Google Drive files:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
