import { defineStore } from 'pinia'
import { ref } from 'vue'
import dataService from '@/services/dataService'

export const useTemplateStore = defineStore('template', () => {
  const templates = ref([])
  const currentTemplate = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchTemplates = async () => {
    loading.value = true
    error.value = null
    try {
      templates.value = await dataService.getTemplates()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching templates:', err)
    } finally {
      loading.value = false
    }
  }

  const getTemplateById = async (templateId) => {
    try {
      return await dataService.getTemplateById(templateId)
    } catch (err) {
      error.value = err.message
      console.error('Error getting template:', err)
      return null
    }
  }

  const createTemplate = async (templateData) => {
    loading.value = true
    error.value = null
    try {
      const newTemplate = await dataService.createTemplate(templateData)
      templates.value.push(newTemplate)
      return newTemplate
    } catch (err) {
      error.value = err.message
      console.error('Error creating template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTemplate = async (templateId, templateData) => {
    loading.value = true
    error.value = null
    try {
      const updatedTemplate = await dataService.updateTemplate(templateId, templateData)
      const index = templates.value.findIndex(t => t.id === templateId)
      if (index !== -1) {
        templates.value[index] = updatedTemplate
      }
      return updatedTemplate
    } catch (err) {
      error.value = err.message
      console.error('Error updating template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (templateId) => {
    loading.value = true
    error.value = null
    try {
      await dataService.deleteTemplate(templateId)
      templates.value = templates.value.filter(t => t.id !== templateId)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentTemplate = (template) => {
    currentTemplate.value = template
  }

  return {
    templates,
    currentTemplate,
    loading,
    error,
    fetchTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setCurrentTemplate
  }
})
