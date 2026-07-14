import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
const cookieHeader = req.headers.get("cookie");
const token = cookieHeader
  ?.split(";")
  .map((c) => c.trim())
  .find((c) => c.startsWith("token="))
  ?.slice("token=".length);

    if (!token) {
      return NextResponse.json({ success: false, message: "No token found" }, { status: 401 });
    }

    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.message || "Failed to get user profile" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Auth /me error:", err);

    return NextResponse.json(
      {
        success: false,
        message: String(err),
      },
      { status: 500 }
    );
    /*return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });*/
  }
}
