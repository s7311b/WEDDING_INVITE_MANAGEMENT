<template>
  <div
    class="invite-hyperlink"
    :style="componentStyle"
  >
    <a
      :href="data.url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
      :class="buttonClass"
    >
      <span v-if="data.icon" class="mr-2">
        {{ getIcon(data.icon) }}
      </span>
      {{ data.text }}
    </a>
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
  textAlign: props.style.textAlign || 'center'
}))

const buttonClass = computed(() => {
  const style = props.data.buttonStyle || 'primary'

  const styleMap = {
    primary: 'bg-wedding-accent text-white hover:bg-wedding-secondary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    gold: 'bg-wedding-gold text-white hover:bg-yellow-600',
    rose: 'bg-wedding-rose text-white hover:bg-pink-400'
  }

  return styleMap[style] || styleMap.primary
})

const getIcon = (iconName) => {
  const icons = {
    message: '💌',
    heart: '❤️',
    gift: '🎁',
    calendar: '📅',
    location: '📍',
    phone: '📞',
    camera: '📷'
  }

  return icons[iconName] || ''
}
</script>
