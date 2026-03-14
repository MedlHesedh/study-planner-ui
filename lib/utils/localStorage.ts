/**
 * Safe localStorage utility for client-side persistence
 */

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    const item = window.localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }

    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export function saveToLocalStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error)
    return false
  }
}

export function removeFromLocalStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
    return false
  }
}

export function clearLocalStorage(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}
