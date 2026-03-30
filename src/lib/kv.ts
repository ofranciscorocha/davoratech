import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '',
})

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await redis.get<T>(key)
    return data ?? fallback
  } catch {
    return fallback
  }
}

export async function kvSet(key: string, value: any): Promise<boolean> {
  try {
    await redis.set(key, value)
    return true
  } catch {
    return false
  }
}
