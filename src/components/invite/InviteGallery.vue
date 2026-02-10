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
        class="overflow-hidden rounded"
      >
        <img
          :src="image.url"
          :alt="image.alt || `Gallery image ${index + 1}`"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
</script>
