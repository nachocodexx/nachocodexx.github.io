export const PUBLIC_CACHE_TTL_MS = 60_000

export interface TimedCacheEntry<T> {
  cachedAt: number
  data: T
}

type CacheBucket = Record<string, TimedCacheEntry<unknown>>

const memoryBuckets = new Map<string, CacheBucket>()
const pendingRequests = new Map<string, Promise<unknown>>()
const storageFailures = new Set<string>()

function memoryBucket (namespace: string) {
  let bucket = memoryBuckets.get(namespace)

  if (!bucket) {
    bucket = {}
    memoryBuckets.set(namespace, bucket)
  }

  return bucket
}

function normalizeEntry<T> (value: unknown): TimedCacheEntry<T> | null {
  if (!value || typeof value !== 'object' || !('data' in value)) {
    return null
  }

  const entry = value as Partial<TimedCacheEntry<T>>

  return {
    cachedAt: typeof entry.cachedAt === 'number' && Number.isFinite(entry.cachedAt)
      ? entry.cachedAt
      : 0,
    data: entry.data as T,
  }
}

function readStorageBucket (namespace: string): CacheBucket | null {
  if (!import.meta.client || storageFailures.has(namespace)) {
    return null
  }

  try {
    const value = JSON.parse(localStorage.getItem(namespace) ?? 'null')

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null
    }

    const bucket: CacheBucket = {}

    for (const [key, entry] of Object.entries(value)) {
      const normalized = normalizeEntry(entry)

      if (normalized) {
        bucket[key] = normalized
      }
    }

    return bucket
  } catch {
    storageFailures.add(namespace)
    return null
  }
}

function persistBucket (namespace: string, bucket: CacheBucket) {
  if (!import.meta.client || storageFailures.has(namespace)) {
    return
  }

  try {
    localStorage.setItem(namespace, JSON.stringify(bucket))
  } catch {
    storageFailures.add(namespace)
    // The memory bucket remains available if storage is disabled or full.
  }
}

export function readTimedCache<T> (
  namespace: string,
  key: string,
  isData?: (value: unknown) => value is T,
) {
  const storageBucket = readStorageBucket(namespace)

  if (storageBucket) {
    memoryBuckets.set(namespace, storageBucket)
  }

  const entry = normalizeEntry<T>((storageBucket ?? memoryBucket(namespace))[key])

  return entry && (!isData || isData(entry.data)) ? entry : null
}

export function writeTimedCache<T> (
  namespace: string,
  key: string,
  data: T,
  cachedAt = Date.now(),
) {
  const bucket = readStorageBucket(namespace) ?? memoryBucket(namespace)
  const entry: TimedCacheEntry<T> = { cachedAt, data }

  bucket[key] = entry
  memoryBuckets.set(namespace, bucket)
  persistBucket(namespace, bucket)

  return entry
}

export function removeTimedCache (
  namespace: string,
  matches: string | ((key: string) => boolean),
) {
  const bucket = readStorageBucket(namespace) ?? memoryBucket(namespace)
  const shouldRemove = typeof matches === 'string'
    ? (key: string) => key === matches
    : matches

  for (const key of Object.keys(bucket)) {
    if (shouldRemove(key)) {
      delete bucket[key]
    }
  }

  memoryBuckets.set(namespace, bucket)
  persistBucket(namespace, bucket)
}

export function isTimedCacheFresh (
  entry: TimedCacheEntry<unknown> | null,
  now = Date.now(),
  ttl = PUBLIC_CACHE_TTL_MS,
) {
  if (!entry || !Number.isFinite(entry.cachedAt) || entry.cachedAt > now) {
    return false
  }

  return now - entry.cachedAt < ttl
}

export function dedupeTimedCacheRequest<T> (
  namespace: string,
  key: string,
  request: () => Promise<T>,
) {
  const pendingKey = `${namespace}:${key}`
  const existing = pendingRequests.get(pendingKey) as Promise<T> | undefined

  if (existing) {
    return existing
  }

  const pending = request().finally(() => {
    if (pendingRequests.get(pendingKey) === pending) {
      pendingRequests.delete(pendingKey)
    }
  })

  pendingRequests.set(pendingKey, pending)

  return pending
}
