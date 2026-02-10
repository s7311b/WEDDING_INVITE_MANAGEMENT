import { storageService } from './storageService'
import usersData from '@/mock/users.json'
import templatesData from '@/mock/templates.json'
import customizationsData from '@/mock/customizations.json'

export const mockService = {
  // Initialize data from JSON files to localStorage if not exists
  initializeData() {
    if (!storageService.get('USERS')) {
      storageService.set('USERS', usersData)
    }
    if (!storageService.get('TEMPLATES')) {
      storageService.set('TEMPLATES', templatesData)
    }
    if (!storageService.get('CUSTOMIZATIONS')) {
      storageService.set('CUSTOMIZATIONS', customizationsData)
    }
  },

  // Users CRUD
  async getUsers() {
    await this.delay()
    return storageService.get('USERS') || []
  },

  async getUserById(userId) {
    await this.delay()
    const users = storageService.get('USERS') || []
    return users.find(user => user.id === userId)
  },

  async createUser(userData) {
    await this.delay()
    const users = storageService.get('USERS') || []

    // Check if ID is provided
    if (!userData.id) {
      throw new Error('User ID is required')
    }

    // Check for duplicate ID
    const existingUser = users.find(user => user.id === userData.id)
    if (existingUser) {
      throw new Error(`User ID already exists: ${userData.id}`)
    }

    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    users.push(newUser)
    storageService.set('USERS', users)
    return newUser
  },

  async updateUser(userId, userData) {
    await this.delay()
    const users = storageService.get('USERS') || []
    const index = users.findIndex(user => user.id === userId)
    if (index !== -1) {
      // ID는 변경 불가 - userData에서 id 제외
      const { id, ...updateData } = userData
      users[index] = { ...users[index], ...updateData }
      storageService.set('USERS', users)
      return users[index]
    }
    throw new Error('User not found')
  },

  async deleteUser(userId) {
    await this.delay()
    const users = storageService.get('USERS') || []
    const filteredUsers = users.filter(user => user.id !== userId)
    storageService.set('USERS', filteredUsers)

    // Also delete user's customization
    const customizations = storageService.get('CUSTOMIZATIONS') || {}
    delete customizations[userId]
    storageService.set('CUSTOMIZATIONS', customizations)

    return true
  },

  async toggleUserActive(userId) {
    await this.delay()
    const users = storageService.get('USERS') || []
    const user = users.find(user => user.id === userId)
    if (user) {
      user.isActive = !user.isActive
      storageService.set('USERS', users)
      return user
    }
    throw new Error('User not found')
  },

  // Templates CRUD
  async getTemplates() {
    await this.delay()
    return storageService.get('TEMPLATES') || []
  },

  async getTemplateById(templateId) {
    await this.delay()
    const templates = storageService.get('TEMPLATES') || []
    return templates.find(template => template.id === templateId)
  },

  async createTemplate(templateData) {
    await this.delay()
    const templates = storageService.get('TEMPLATES') || []
    const newTemplate = {
      id: `template-${templates.length + 1}`,
      ...templateData,
      components: templateData.components || []
    }
    templates.push(newTemplate)
    storageService.set('TEMPLATES', templates)
    return newTemplate
  },

  async updateTemplate(templateId, templateData) {
    await this.delay()
    const templates = storageService.get('TEMPLATES') || []
    const index = templates.findIndex(template => template.id === templateId)
    if (index !== -1) {
      templates[index] = { ...templates[index], ...templateData }
      storageService.set('TEMPLATES', templates)
      return templates[index]
    }
    throw new Error('Template not found')
  },

  async deleteTemplate(templateId) {
    await this.delay()
    const templates = storageService.get('TEMPLATES') || []
    const filteredTemplates = templates.filter(template => template.id !== templateId)
    storageService.set('TEMPLATES', filteredTemplates)
    return true
  },

  // Customizations CRUD
  async getCustomizations() {
    await this.delay()
    return storageService.get('CUSTOMIZATIONS') || {}
  },

  async getCustomizationByUserId(userId) {
    await this.delay()
    const customizations = storageService.get('CUSTOMIZATIONS') || {}
    return customizations[userId]
  },

  async saveCustomization(userId, customizationData) {
    await this.delay()
    const customizations = storageService.get('CUSTOMIZATIONS') || {}
    customizations[userId] = {
      userId,
      ...customizationData,
      lastModified: new Date().toISOString()
    }
    storageService.set('CUSTOMIZATIONS', customizations)
    return customizations[userId]
  },

  async deleteCustomization(userId) {
    await this.delay()
    const customizations = storageService.get('CUSTOMIZATIONS') || {}
    delete customizations[userId]
    storageService.set('CUSTOMIZATIONS', customizations)
    return true
  },

  // Get invite data for a specific user (merged customization or template)
  async getInviteData(userId) {
    await this.delay()

    const user = await this.getUserById(userId)
    if (!user || !user.isActive) {
      return null
    }

    // Check if user has customization
    const customization = await this.getCustomizationByUserId(userId)
    if (customization) {
      return {
        user,
        components: customization.components,
        templateId: customization.templateId,
        backgroundColor: customization.backgroundColor,
        backgroundImage: customization.backgroundImage
      }
    }

    // Fall back to template if no customization
    if (user.templateId) {
      const template = await this.getTemplateById(user.templateId)
      if (template) {
        return {
          user,
          components: template.components,
          templateId: template.id,
          backgroundColor: template.backgroundColor,
          backgroundImage: template.backgroundImage
        }
      }
    }

    return null
  },

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Initialize data on import
mockService.initializeData()
