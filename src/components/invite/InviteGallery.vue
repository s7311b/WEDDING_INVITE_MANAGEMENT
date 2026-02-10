<template>
  <div
    class="invite-gallery"
    :style="props.style"
  >
    <div
      class="grid gap-2"
      :class="gridClass"
    >
      <div
        v-for="(image, index) in data.images"
        :key="index"
        class="overflow-hidden rounded relative bg-gray-100"
        :class="{ 'aspect-square': true }"
      >
        <!-- Skeleton loader -->
        <div
          v-if="imageStates[index]?.loading"
          class="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse"
        >
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Error state -->
        <div
          v-else-if="imageStates[index]?.error"
          class="absolute inset-0 flex items-center justify-center"
        >
          <img
            src="/images/error-image.svg"
            alt="이미지 로딩 실패"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- No image (empty URL) -->
        <div
          v-else-if="!image.url"
          class="absolute inset-0 flex items-center justify-center"
        >
          <img
            src="/images/placeholder-image.svg"
            alt="이미지 없음"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Actual image -->
        <img
          v-else
          :src="image.url"
          :alt="image.alt || `Gallery image ${index + 1}`"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          :class="{ 'invisible': imageStates[index]?.loading || imageStates[index]?.error }"
          loading="lazy"
          @load="handleImageLoad(index)"
          @error="handleImageError(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

// Track loading and error states for each image
const imageStates = reactive({})

// Initialize image states
const initializeImageStates = () => {
  if (props.data.images) {
    props.data.images.forEach((image, index) => {
      if (!imageStates[index]) {
        imageStates[index] = {
          loading: !!image.url, // Only show loading if URL exists
          error: false
        }
      }
    })
  }
}

// Initialize on mount and when images change
watch(() => props.data.images, () => {
  initializeImageStates()
}, { immediate: true, deep: true })

const gridClass = computed(() => {
  const layout = props.data.layout || '2x2'

  const layoutMap = {
    '1x1': 'grid-cols-1',
    '2x1': 'grid-cols-2',
    '2x2': 'grid-cols-2',
    '3x1': 'grid-cols-3',
    '3x3': 'grid-cols-3',
    '4x1': 'grid-cols-4'
  }

  return layoutMap[layout] || 'grid-cols-2'
})

const handleImageLoad = (index) => {
  if (imageStates[index]) {
    imageStates[index].loading = false
    imageStates[index].error = false
  }
}

const handleImageError = (index) => {
  if (imageStates[index]) {
    imageStates[index].loading = false
    imageStates[index].error = true
  }
}
</script>
