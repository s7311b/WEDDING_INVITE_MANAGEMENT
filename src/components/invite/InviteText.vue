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

const componentStyle = computed(() => ({
  ...props.style,
  textAlign: props.data.textAlign || 'left'
}))

const titleStyle = computed(() => ({
  fontSize: props.data.fontSize || '24px',
  color: props.data.color || '#333333'
}))

const contentStyle = computed(() => ({
  fontSize: props.data.contentFontSize || '16px',
  color: props.data.color || '#333333'
}))

const formatContent = (content) => {
  return content.replace(/\n/g, '<br>')
}
</script>
