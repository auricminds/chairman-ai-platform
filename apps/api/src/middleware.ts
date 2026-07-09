import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://app.ai.chairmans.uk",
  "https://ai.chairmans.uk",
  "https://admin.chairmans.uk",
  "http://localhost:3001",
  "http://localhost:3002",
];

// Routes that accept API key auth from any origin (public developer API).
// Auth is enforced via the API key itself, not the request origin.
const PUBLIC_API_PREFIXES = [
  "/v1/chat/completions",
  "/v1/developer/",
];

function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const pathname = request.nextUrl.pathname;

  // Public API routes: allow any origin (auth is via API key, not origin)
  const allowOrigin = isPublicApiPath(pathname)
    ? (origin || "*")
    : ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Chairman-Site-Key",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Chairman-Site-Key");
  return response;
}

export const config = {
  matcher: "/v1/:path*",
};
