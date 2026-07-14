import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params, "GET");
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params, "POST");
}

export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params, "PUT");
}

export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params, "DELETE");
}

async function handleProxy(req: Request, params: { path: string[] }, method: string) {
  try {
    const pathJoined = params.path.join("/");
    
    // Extract query parameters
    const { search } = new URL(req.url);
    const targetUrl = `http://localhost:5000/api/${pathJoined}${search}`;

    const token = req.headers.get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let body = undefined;
    if (method !== "GET" && method !== "HEAD") {
      const contentType = req.headers.get("content-type");
 if (contentType && contentType.includes("multipart/form-data")) {
  const formData = await req.formData();
  const response = await fetch(targetUrl, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // no Content-Type here — fetch sets its own correct boundary automatically
    },
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
} else {
        body = JSON.stringify(await req.json().catch(() => ({})));
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
