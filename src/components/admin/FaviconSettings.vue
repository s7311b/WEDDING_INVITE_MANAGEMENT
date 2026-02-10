<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Favicon 설정</h2>
    <p class="text-sm text-gray-600 mb-4">
      브라우저 탭에 표시될 아이콘을 선택하세요.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        v-for="option in faviconOptions"
        :key="option.value"
        @click="selectFavicon(option.value)"
        class="p-4 border-2 rounded-lg transition-all hover:shadow-md"
        :class="{
          'border-wedding-secondary bg-wedding-primary': configStore.faviconType === option.value,
          'border-gray-300 hover:border-wedding-secondary': configStore.faviconType !== option.value
        }"
      >
        <div class="flex flex-col items-center">
          <img
            :src="`/favicons/${option.value}.svg`"
            :alt="option.label"
            class="w-16 h-16 mb-2"
          />
          <span class="text-sm font-medium text-gray-700">{{ option.label }}</span>
        </div>
      </button>
    </div>

    <div class="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
      <strong>현재 선택:</strong> {{ currentLabel }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { FAVICON_OPTIONS } from '@/config'

const configStore = useConfigStore()

const faviconOptions = [
  { value: FAVICON_OPTIONS.BRIDE_GROOM, label: '신랑 & 신부' },
  { value: FAVICON_OPTIONS.WEDDING_CARD, label: '웨딩 카드' },
  { value: FAVICON_OPTIONS.BOUQUET, label: '부케' }
]

const currentLabel = computed(() => {
  const option = faviconOptions.find(opt => opt.value === configStore.faviconType)
  return option ? option.label : '알 수 없음'
})

const selectFavicon = (type) => {
  configStore.setFaviconType(type)
}
</script>
