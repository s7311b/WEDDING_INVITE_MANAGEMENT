import apiClient from './api'
import config from '@/config'

const API_URL = config.API_URL

export const apiService = {
  // Users CRUD
  async getUsers() {
    return await apiClient.get(`${API_URL}/users`)
  },

  async getUserById(userId) {
    return await apiClient.get(`${API_URL}/users/${userId}`)
  },

  async createUser(userData) {
    return await apiClient.post(`${API_URL}/users`, userData)
  },

  async updateUser(userId, userData) {
    return await apiClient.put(`${API_URL}/users/${userId}`, userData)
  },

  async deleteUser(userId) {
    return await apiClient.delete(`${API_URL}/users/${userId}`)
  },

  async toggleUserActive(userId) {
    return await apiClient.patch(`${API_URL}/users/${userId}/toggle`)
  },

  // Templates CRUD
  async getTemplates() {
    return await apiClient.get(`${API_URL}/templates`)
  },

  async getTemplateById(templateId) {
    return await apiClient.get(`${API_URL}/templates/${templateId}`)
  },

  async createTemplate(templateData) {
    return await apiClient.post(`${API_URL}/templates`, templateData)
  },

  async updateTemplate(templateId, templateData) {
    return await apiClient.put(`${API_URL}/templates/${templateId}`, templateData)
  },

  async deleteTemplate(templateId) {
    return await apiClient.delete(`${API_URL}/templates/${templateId}`)
  },

  // Customizations CRUD
  async getCustomizations() {
    return await apiClient.get(`${API_URL}/customizations`)
  },

  async getCustomizationByUserId(userId) {
    try {
      return await apiClient.get(`${API_URL}/customizations/${userId}`)
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  async saveCustomization(userId, customizationData) {
    return await apiClient.post(`${API_URL}/customizations/${userId}`, customizationData)
  },

  async deleteCustomization(userId) {
    return await apiClient.delete(`${API_URL}/customizations/${userId}`)
  },

  // Get invite data for a specific user
  async getInviteData(userId) {
    try {
      return await apiClient.get(`${API_URL}/invite/${userId}`)
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }
}
