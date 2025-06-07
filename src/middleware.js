import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const protectedRoutes = ["/api/protected"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Hanya lindungi route tertentu
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
    }

    // Optional: teruskan user ke handler dengan request headers baru
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-role", user.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

// Hanya untuk route API tertentu
export const config = {
  matcher: ["/api/protected/:path*"],
};

// contoh endpoint api/protected/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const userId = req.headers.get("x-user-id");
//   return NextResponse.json({ message: "POST method success", userId });
// }

// export async function GET() {
//   return NextResponse.json({ message: "GET is public" });
// }

// simpan di front end local storage lalu kirim

// fetch("/api/protected", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });
