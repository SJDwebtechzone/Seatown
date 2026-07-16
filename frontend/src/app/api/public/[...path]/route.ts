import { NextResponse } from "next/server";

// Public (unauthenticated) proxy — forwards requests to /api/public/* on the Express backend.
// No token required.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handlePublicProxy(req, await params, "GET");
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handlePublicProxy(req, await params, "POST");
}

async function handlePublicProxy(req: Request, params: { path: string[] }, method: string) {
  try {
    const pathJoined = params.path.join("/");
    const { search } = new URL(req.url);
    const targetUrl = `${API_URL}/api/public/${pathJoined}${search}`;

    const headers: Record<string, string> = {};

    let body: BodyInit | undefined = undefined;

    if (method !== "GET") {
      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("multipart/form-data")) {
        // Forward form-data as-is for file uploads (e.g., review photo)
        const formData = await req.formData();
        const response = await fetch(targetUrl, {
          method,
          body: formData,
          // Do NOT set Content-Type; let fetch set the boundary automatically
        });
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(await req.json().catch(() => ({})));
      }
    }

    const response = await fetch(targetUrl, { method, headers, body });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Public proxy error:", err);
    return NextResponse.json({ success: false, message: "Public proxy error" }, { status: 500 });
  }
}