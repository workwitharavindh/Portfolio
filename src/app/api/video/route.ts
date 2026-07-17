import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
    
    // 1. Initial fetch to get confirm code if redirected to warning page
    let initialRes = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    let targetUrl = driveUrl;
    const contentType = initialRes.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      const htmlText = await initialRes.text();
      const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9-_]+)/);
      if (confirmMatch) {
        targetUrl = `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${id}`;
      }
    }

    // 2. Fetch the stream with range headers from client
    const clientHeaders = new Headers();
    clientHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    
    const clientRange = request.headers.get("range");
    if (clientRange) {
      clientHeaders.set("Range", clientRange);
    }

    const streamRes = await fetch(targetUrl, {
      headers: clientHeaders,
    });

    // 3. Forward stream headers to client
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", streamRes.headers.get("content-type") || "video/mp4");
    responseHeaders.set("Accept-Ranges", "bytes");

    const contentRange = streamRes.headers.get("content-range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    const contentLength = streamRes.headers.get("content-length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);

    return new Response(streamRes.body, {
      status: streamRes.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error("Error streaming video:", error);
    return new Response("Error streaming video", { status: 500 });
  }
}
