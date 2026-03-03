export interface CollectionItem {
  id: string
  title: string
  createdAt: string
  synonyms: string[]
}

export const COLLECTIONS_STORAGE_KEY = 'hiresignal.collections'

export function readCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored) as CollectionItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeCollections(items: CollectionItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(items))
}

export function addCollection(item: CollectionItem) {
  const existing = readCollections()
  const next = [item, ...existing]
  writeCollections(next)
  return next
}
