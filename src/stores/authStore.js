import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  // Check session storage on init
  const storedAuth = sessionStorage.getItem('wedding_admin_auth')
  if (storedAuth === 'true') {
    isAuthenticated.value = true
  }

  const login = (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      isAuthenticated.value = true
      sessionStorage.setItem('wedding_admin_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    sessionStorage.removeItem('wedding_admin_auth')
  }

  return {
    isAuthenticated,
    login,
    logout
  }
})
