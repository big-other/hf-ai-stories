import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing KV_REST_API_URL or KV_REST_API_TOKEN environment variables. " +
        "Add an Upstash Redis integration in Vercel or set these locally."
    );
  }

  _redis = new Redis({ url, token });
  return _redis;
}
