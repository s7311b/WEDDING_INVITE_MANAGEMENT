import { ref } from 'vue'
import { getFontById } from '@/config/fonts'

// 로드된 폰트를 추적하는 Set (중복 로드 방지)
const loadedFonts = new Set()

// 로딩 상태
const loading = ref(false)
const error = ref(null)

/**
 * Google Fonts를 동적으로 로드하는 composable
 */
export function useFontLoader() {
  /**
   * 폰트 로드
   * @param {string} fontId - 로드할 폰트의 ID
   * @returns {Promise<boolean>} 로드 성공 여부
   */
  const loadFont = async (fontId) => {
    if (!fontId) {
      return false
    }

    // 이미 로드된 폰트인지 확인
    if (loadedFonts.has(fontId)) {
      console.log(`Font already loaded: ${fontId}`)
      return true
    }

    const font = getFontById(fontId)
    if (!font) {
      console.error(`Font not found: ${fontId}`)
      error.value = `Font not found: ${fontId}`
      return false
    }

    loading.value = true
    error.value = null

    try {
      // 기존 링크 태그가 있는지 확인
      const existingLink = document.querySelector(`link[data-font-id="${fontId}"]`)
      if (existingLink) {
        loadedFonts.add(fontId)
        loading.value = false
        return true
      }

      // Google Fonts link 태그 생성
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = font.googleFontsUrl
      link.setAttribute('data-font-id', fontId)

      // 로드 완료 대기
      await new Promise((resolve, reject) => {
        link.onload = () => {
          loadedFonts.add(fontId)
          console.log(`Font loaded successfully: ${font.name}`)
          resolve()
        }
        link.onerror = () => {
          console.error(`Failed to load font: ${font.name}`)
          reject(new Error(`Failed to load font: ${font.name}`))
        }

        document.head.appendChild(link)

        // 타임아웃 설정 (10초)
        setTimeout(() => {
          if (!loadedFonts.has(fontId)) {
            reject(new Error('Font load timeout'))
          }
        }, 10000)
      })

      loading.value = false
      return true
    } catch (err) {
      loading.value = false
      error.value = err.message
      console.error('Font loading error:', err)
      return false
    }
  }

  /**
   * 여러 폰트를 동시에 로드
   * @param {Array<string>} fontIds - 로드할 폰트 ID 배열
   * @returns {Promise<Array<boolean>>} 각 폰트의 로드 성공 여부
   */
  const loadFonts = async (fontIds) => {
    const promises = fontIds.filter(id => id).map(id => loadFont(id))
    return await Promise.all(promises)
  }

  /**
   * 폰트가 로드되었는지 확인
   * @param {string} fontId
   * @returns {boolean}
   */
  const isFontLoaded = (fontId) => {
    return loadedFonts.has(fontId)
  }

  /**
   * 로드된 모든 폰트 목록
   * @returns {Array<string>}
   */
  const getLoadedFonts = () => {
    return Array.from(loadedFonts)
  }

  return {
    loadFont,
    loadFonts,
    isFontLoaded,
    getLoadedFonts,
    loading,
    error
  }
}
