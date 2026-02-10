import { defineStore } from 'pinia'
import { ref } from 'vue'
import dataService from '@/services/dataService'

export const useInviteStore = defineStore('invite', () => {
  const inviteData = ref(null)
  const customizations = ref({})
  const loading = ref(false)
  const error = ref(null)

  const fetchInviteData = async (userId) => {
    loading.value = true
    error.value = null
    try {
      inviteData.value = await dataService.getInviteData(userId)
      return inviteData.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching invite data:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchCustomizations = async () => {
    loading.value = true
    error.value = null
    try {
      customizations.value = await dataService.getCustomizations()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customizations:', err)
    } finally {
      loading.value = false
    }
  }

  const getCustomizationByUserId = async (userId) => {
    try {
      return await dataService.getCustomizationByUserId(userId)
    } catch (err) {
      error.value = err.message
      console.error('Error getting customization:', err)
      return null
    }
  }

  const saveCustomization = async (userId, customizationData) => {
    loading.value = true
    error.value = null
    try {
      const saved = await dataService.saveCustomization(userId, customizationData)
      customizations.value[userId] = saved
      return saved
    } catch (err) {
      error.value = err.message
      console.error('Error saving customization:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCustomization = async (userId) => {
    loading.value = true
    error.value = null
    try {
      await dataService.deleteCustomization(userId)
      delete customizations.value[userId]
    } catch (err) {
      error.value = err.message
      console.error('Error deleting customization:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    inviteData,
    customizations,
    loading,
    error,
    fetchInviteData,
    fetchCustomizations,
    getCustomizationByUserId,
    saveCustomization,
    deleteCustomization
  }
})
