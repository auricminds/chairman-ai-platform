import type { NextConfig } from "next";

const ALLOWED_ORIGINS = [
  "https://app.ai.chairmans.uk",
  "https://ai.chairmans.uk",
  "http://localhost:3001",
];

const CORS_HEADERS = (origin: string) => [
  { key: "Access-Control-Allow-Origin", value: origin },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  async headers() {
    return ALLOWED_ORIGINS.map((origin) => ({
      source: "/(.*)",
      headers: CORS_HEADERS(origin),
    }));
  },
};

export default nextConfig;
