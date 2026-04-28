import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// Limites par route (requêtes / fenêtre de 60s)
const LIMITES: Record<string, number> = {
  default: 20,
  scan: 10,
  prononcer: 15,
};

const limiteurs = new Map<string, Ratelimit>();

function getLimiteur(route: string): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  if (!limiteurs.has(route)) {
    const max = LIMITES[route] ?? LIMITES.default;
    limiteurs.set(
      route,
      new Ratelimit({
        redis: r,
        limiter: Ratelimit.slidingWindow(max, "60 s"),
        prefix: `revioria:rl:${route}`,
      })
    );
  }
  return limiteurs.get(route)!;
}

export async function checkRateLimit(
  ip: string,
  route: string
): Promise<{ autorise: boolean; fallback: boolean }> {
  const limiteur = getLimiteur(route);

  // Si Upstash non configuré, fallback silencieux (on laisse passer)
  if (!limiteur) return { autorise: true, fallback: true };

  const { success } = await limiteur.limit(ip);
  return { autorise: success, fallback: false };
}
