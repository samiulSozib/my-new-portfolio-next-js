import "server-only";

import { headers } from "next/headers";

/*
 * A small fixed-window rate limiter kept in memory. On Vercel each function instance has its own memory,
 * so this is best effort: it stops a single client hammering one instance, not a distributed attack.
 * For stronger limits, swap this for Upstash Redis (@upstash/ratelimit) or Vercel's firewall rules.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function hit(key: string, limit: number, windowSeconds: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowSeconds * 1000 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;

  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  return { allowed: bucket.count <= limit, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
}

export function clear(key: string): void {
  buckets.delete(key);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Returns a 429 response when the client is over the limit, otherwise null. */
export async function throttle(name: string, limit: number, windowSeconds: number): Promise<Response | null> {
  const { allowed, retryAfter } = hit(`${name}:${await clientIp()}`, limit, windowSeconds);
  if (allowed) return null;
  return Response.json(
    { message: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
