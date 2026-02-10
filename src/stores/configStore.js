import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { FAVICON_OPTIONS, updateFavicon } from '@/config'

const CONFIG_STORAGE_KEY = 'wedding_invite_config'

export const useConfigStore = defineStore('config', () => {
  // 상태
  const useDatabase = ref(false)
  const faviconType = ref(FAVICON_OPTIONS.BRIDE_GROOM)

  // LocalStorage에서 설정 로드
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY)
      if (stored) {
        const config = JSON.parse(stored)
        useDatabase.value = config.useDatabase ?? false
        faviconType.value = config.faviconType ?? FAVICON_OPTIONS.BRIDE_GROOM
      }
    } catch (error) {
      console.error('Failed to load config from storage:', error)
    }
  }

  // LocalStorage에 설정 저장
  function saveToStorage() {
    try {
      const config = {
        useDatabase: useDatabase.value,
        faviconType: faviconType.value
      }
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      console.error('Failed to save config to storage:', error)
    }
  }

  // 데이터 소스 토글
  function toggleDataSource() {
    useDatabase.value = !useDatabase.value
    saveToStorage()
  }

  // 데이터 소스 설정
  function setDataSource(value) {
    useDatabase.value = value
    saveToStorage()
  }

  // Favicon 변경
  function setFaviconType(type) {
    if (Object.values(FAVICON_OPTIONS).includes(type)) {
      faviconType.value = type
      updateFavicon(type)
      saveToStorage()
    } else {
      console.error('Invalid favicon type:', type)
    }
  }

  // 설정 변경 감지하여 자동 저장
  watch([useDatabase, faviconType], () => {
    saveToStorage()
  })

  // 초기화
  loadFromStorage()

  return {
    useDatabase,
    faviconType,
    toggleDataSource,
    setDataSource,
    setFaviconType,
    loadFromStorage
  }
})
