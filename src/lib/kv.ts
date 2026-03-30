import { kv } from '@vercel/kv'

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await kv.get<T>(key)
    return data ?? fallback
  } catch {
    return fallback
  }
}

export async function kvSet(key: string, value: any): Promise<boolean> {
  try {
    await kv.set(key, value)
    return true
  } catch {
    return false
  }
}
