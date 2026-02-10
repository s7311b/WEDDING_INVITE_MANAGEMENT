<template>
  <div
    class="invite-text"
    :style="componentStyle"
  >
    <h2
      v-if="data.title"
      class="font-bold mb-4"
      :style="titleStyle"
    >
      {{ data.title }}
    </h2>
    <div
      v-if="data.content"
      class="whitespace-pre-wrap"
      :style="contentStyle"
      v-html="formatContent(data.content)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFontPriority } from '@/composables/useFontPriority'

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

// 폰트 우선순위 적용
const componentFontId = computed(() => props.data.fontFamily || null)
const { fontFamily } = useFontPriority(componentFontId)

const componentStyle = computed(() => ({
  ...props.style,
  textAlign: props.data.textAlign || 'left',
  fontFamily: fontFamily.value
}))

const titleStyle = computed(() => ({
  fontSize: props.data.fontSize || '24px',
  color: props.data.color || '#333333',
  fontFamily: fontFamily.value
}))

const contentStyle = computed(() => ({
  fontSize: props.data.contentFontSize || '16px',
  color: props.data.color || '#333333',
  fontFamily: fontFamily.value
}))

const formatContent = (content) => {
  return content.replace(/\n/g, '<br>')
}
</script>
