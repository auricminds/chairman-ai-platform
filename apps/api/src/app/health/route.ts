import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "chairman-ai-api",
    timestamp: new Date().toISOString(),
  });
}
