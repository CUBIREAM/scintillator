import { useCallback, useEffect, useState } from 'react'

const EXPIRATION_MS = 15 * 60 * 1000 // 15 minutes

interface LastViewedData {
  id: string
  timestamp: number
}

export const useLastViewed = (type: 'report' | 'image') => {
  const storageKey = `lastViewed:${type}`
  const [lastViewedId, setLastViewedId] = useState<string | null>(null)

  // Load from local storage on mount
  useEffect(() => {
    const load = () => {
      try {
        const item = localStorage.getItem(storageKey)
        if (item) {
          const data: LastViewedData = JSON.parse(item)
          const now = Date.now()
          if (now - data.timestamp < EXPIRATION_MS) {
            setLastViewedId(data.id)
          } else {
            localStorage.removeItem(storageKey)
            setLastViewedId(null)
          }
        }
      } catch (e) {
        console.error('Failed to parse last viewed data', e)
      }
    }

    load()
    // Listen for storage events to sync across tabs/windows or same-page updates
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [storageKey])

  const markVisited = useCallback(
    (id: string) => {
      const data: LastViewedData = {
        id,
        timestamp: Date.now()
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
      setLastViewedId(id)
      // Dispatch a storage event manually for same-page updates in other components
      window.dispatchEvent(new Event('storage'))
    },
    [storageKey]
  )

  return { lastViewedId, markVisited }
}
