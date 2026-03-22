import { useState, useEffect } from 'react'
import type { WardrobeItem } from '../types/fashion'

const STORAGE_KEY = 'sillage_wardrobe'

function load(): WardrobeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as WardrobeItem[]
  } catch {
    // corrupted storage — start fresh
  }
  return []
}

function save(items: WardrobeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useWardrobe() {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(load)

  // Persist to localStorage on every change
  useEffect(() => {
    save(wardrobe)
  }, [wardrobe])

  /** Add a new item; silently skip if the garment is already saved. */
  function addItem(item: WardrobeItem) {
    setWardrobe(prev => {
      if (prev.some(w => w.garment.id === item.garment.id)) return prev
      return [...prev, item]
    })
  }

  /** Remove an item by its WardrobeItem id. */
  function removeItem(id: string) {
    setWardrobe(prev => prev.filter(w => w.id !== id))
  }

  /** Increment worn count for a garment. */
  function incrementWorn(id: string) {
    setWardrobe(prev =>
      prev.map(w => (w.id === id ? { ...w, wornCount: w.wornCount + 1 } : w))
    )
  }

  /** Check if a garment (by garment.id) is already in the wardrobe. */
  function isInWardrobe(garmentId: string): boolean {
    return wardrobe.some(w => w.garment.id === garmentId)
  }

  /** Clear all items (for reset / demo). */
  function clearWardrobe() {
    setWardrobe([])
  }

  // Cumulative stats
  const totalCarbon = wardrobe.reduce((sum, w) => sum + w.impact.carbonKg, 0)
  const totalWater = wardrobe.reduce((sum, w) => sum + w.impact.waterUsageLiters, 0)

  return {
    wardrobe,
    addItem,
    removeItem,
    incrementWorn,
    isInWardrobe,
    clearWardrobe,
    totalCarbon,
    totalWater,
  }
}
