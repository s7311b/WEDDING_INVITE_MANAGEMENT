import { computed, inject, watch } from 'vue'
import { getFontById, defaultFont } from '@/config/fonts'
import { useFontLoader } from './useFontLoader'

/**
 * 폰트 우선순위 계산 composable
 * 우선순위: 컴포넌트 폰트 > 템플릿 폰트 > 사용자 폰트 > 기본 폰트
 */
export function useFontPriority(componentFontId) {
  const { loadFont } = useFontLoader()

  // Provide/Inject를 통해 상위에서 전달받는 폰트 ID
  const templateFontId = inject('templateFontId', null)
  const userFontId = inject('userFontId', null)

  /**
   * 우선순위에 따라 유효한 폰트 ID 결정
   */
  const effectiveFontId = computed(() => {
    // 1순위: 컴포넌트 레벨 폰트
    if (componentFontId?.value) {
      return componentFontId.value
    }

    // 2순위: 템플릿 레벨 폰트
    if (templateFontId?.value || templateFontId) {
      return templateFontId.value || templateFontId
    }

    // 3순위: 사용자 레벨 폰트
    if (userFontId?.value || userFontId) {
      return userFontId.value || userFontId
    }

    // 4순위: 기본 폰트
    return defaultFont.id
  })

  /**
   * 유효한 폰트 객체
   */
  const effectiveFont = computed(() => {
    return getFontById(effectiveFontId.value) || defaultFont
  })

  /**
   * CSS font-family 값
   */
  const fontFamily = computed(() => {
    const font = effectiveFont.value
    return `'${font.family}', sans-serif`
  })

  /**
   * 폰트 변경 시 자동 로드
   */
  watch(
    effectiveFontId,
    async (newFontId) => {
      if (newFontId) {
        await loadFont(newFontId)
      }
    },
    { immediate: true }
  )

  return {
    effectiveFontId,
    effectiveFont,
    fontFamily
  }
}
