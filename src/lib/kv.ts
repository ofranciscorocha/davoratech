// Stub para build — APIs de seed/serve são internas e não rodam no Vercel
const store: Record<string, unknown> = {}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  return (store[key] as T) ?? fallback
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function kvSet(key: string, value: any): Promise<boolean> {
  store[key] = value
  return true
}
