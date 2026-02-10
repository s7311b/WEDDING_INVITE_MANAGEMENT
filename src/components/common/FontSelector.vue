<template>
  <div class="font-selector">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <select
      :value="modelValue"
      @change="handleChange"
      class="input-field w-full"
      :class="{ 'with-preview': showPreview }"
    >
      <option value="">-- 폰트 선택 (기본값 사용) --</option>

      <optgroup label="한글 폰트">
        <option
          v-for="font in koreanFonts"
          :key="font.id"
          :value="font.id"
          :style="{ fontFamily: `'${font.family}', sans-serif` }"
        >
          {{ font.name }}
        </option>
      </optgroup>

      <optgroup label="영문 폰트">
        <option
          v-for="font in englishFonts"
          :key="font.id"
          :value="font.id"
          :style="{ fontFamily: `'${font.family}', sans-serif` }"
        >
          {{ font.name }}
        </option>
      </optgroup>
    </select>

    <!-- Preview Area -->
    <div v-if="showPreview && selectedFont" class="mt-3 p-4 border rounded bg-gray-50">
      <p class="text-xs text-gray-500 mb-2">미리보기:</p>
      <p
        class="text-lg"
        :style="{ fontFamily: `'${selectedFont.family}', sans-serif` }"
      >
        {{ previewText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { availableFonts, getFontById } from '@/config/fonts'
import { useFontLoader } from '@/composables/useFontLoader'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  previewText: {
    type: String,
    default: '사랑하는 두 사람이 결혼합니다 ❤️ We are getting married'
  }
})

const emit = defineEmits(['update:modelValue'])

const { loadFont } = useFontLoader()

// 한글/영문 폰트 분리
const koreanFonts = computed(() => {
  return availableFonts.filter(font => font.language === 'korean')
})

const englishFonts = computed(() => {
  return availableFonts.filter(font => font.language === 'english')
})

// 선택된 폰트 객체
const selectedFont = computed(() => {
  if (!props.modelValue) return null
  return getFontById(props.modelValue)
})

// 폰트 변경 핸들러
const handleChange = (event) => {
  const fontId = event.target.value
  emit('update:modelValue', fontId)

  // 선택한 폰트 즉시 로드
  if (fontId) {
    loadFont(fontId)
  }
}

// 초기 폰트 로드
watch(
  () => props.modelValue,
  (newFontId) => {
    if (newFontId) {
      loadFont(newFontId)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.font-selector select.with-preview {
  font-size: 0.95rem;
}

.font-selector optgroup {
  font-weight: 600;
  color: #4B5563;
}

.font-selector option {
  padding: 8px;
}
</style>
