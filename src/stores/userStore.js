import { defineStore } from 'pinia'
import { ref } from 'vue'
import dataService from '@/services/dataService'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await dataService.getUsers()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (userId) => {
    try {
      return await dataService.getUserById(userId)
    } catch (err) {
      error.value = err.message
      console.error('Error getting user:', err)
      return null
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const newUser = await dataService.createUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (err) {
      error.value = err.message
      console.error('Error creating user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId, userData) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await dataService.updateUser(userId, userData)
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err) {
      error.value = err.message
      console.error('Error updating user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId) => {
    loading.value = true
    error.value = null
    try {
      await dataService.deleteUser(userId)
      users.value = users.value.filter(u => u.id !== userId)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleUserActive = async (userId) => {
    try {
      const updatedUser = await dataService.toggleUserActive(userId)
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err) {
      error.value = err.message
      console.error('Error toggling user active:', err)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserActive
  }
})
