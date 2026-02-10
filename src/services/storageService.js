const STORAGE_KEYS = {
  USERS: 'wedding_users',
  TEMPLATES: 'wedding_templates',
  CUSTOMIZATIONS: 'wedding_customizations'
}

export const storageService = {
  // Get data from localStorage
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS[key])
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  },

  // Set data to localStorage
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  },

  // Remove data from localStorage
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_KEYS[key])
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },

  // Clear all wedding-related data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}
