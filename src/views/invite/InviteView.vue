<template>
  <div
    class="min-h-screen"
    :style="backgroundStyle"
  >
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-accent mx-auto mb-4"></div>
        <p class="text-gray-600">청첩장을 불러오는 중...</p>
      </div>
    </div>

    <div v-else-if="error || !inviteData" class="flex items-center justify-center min-h-screen">
      <div class="card max-w-md text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">청첩장을 찾을 수 없습니다</h2>
        <p class="text-gray-600 mb-4">
          요청하신 청첩장이 존재하지 않거나 비활성화되었습니다.
        </p>
        <p class="text-sm text-gray-500">
          문제가 지속되면 관리자에게 문의해 주세요.
        </p>
      </div>
    </div>

    <div v-else class="max-w-3xl mx-auto">
      <div
        v-for="component in sortedComponents"
        :key="component.id"
        class="component-wrapper"
      >
        <component
          :is="getComponentType(component.type)"
          :data="component.data"
          :style="component.style"
        />
      </div>

      <!-- Footer -->
      <div class="text-center py-8 text-gray-500 text-sm">
        <p>{{ inviteData.user.name }}님의 청첩장</p>
        <p class="mt-2">Powered by Wedding Invite Management</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInviteStore } from '@/stores/inviteStore'
import InviteText from '@/components/invite/InviteText.vue'
import InviteGallery from '@/components/invite/InviteGallery.vue'
import InviteHyperlink from '@/components/invite/InviteHyperlink.vue'
import InviteMap from '@/components/invite/InviteMap.vue'
import { useFontLoader } from '@/composables/useFontLoader'

const route = useRoute()
const router = useRouter()
const inviteStore = useInviteStore()
const { loadFonts } = useFontLoader()

const loading = ref(true)
const error = ref(null)

const inviteData = computed(() => inviteStore.inviteData)

// Provide font IDs for font priority system
provide('templateFontId', computed(() => inviteData.value?.template?.fontFamily || null))
provide('userFontId', computed(() => inviteData.value?.user?.fontFamily || null))

const sortedComponents = computed(() => {
  if (!inviteData.value || !inviteData.value.components) {
    return []
  }
  return [...inviteData.value.components].sort((a, b) => a.order - b.order)
})

const backgroundStyle = computed(() => {
  if (!inviteData.value) {
    return {
      background: 'linear-gradient(to bottom, #F8E8E8, white)'
    }
  }

  const style = {}

  if (inviteData.value.backgroundImage) {
    style.backgroundImage = `url(${inviteData.value.backgroundImage})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
    style.backgroundAttachment = 'fixed'
  } else if (inviteData.value.backgroundColor) {
    style.backgroundColor = inviteData.value.backgroundColor
  } else {
    style.background = 'linear-gradient(to bottom, #F8E8E8, white)'
  }

  return style
})

const getComponentType = (type) => {
  const componentMap = {
    text: InviteText,
    gallery: InviteGallery,
    hyperlink: InviteHyperlink,
    map: InviteMap
  }
  return componentMap[type] || InviteText
}

onMounted(async () => {
  const userId = route.params.userId

  if (!userId) {
    router.push({ name: 'not-found' })
    return
  }

  try {
    const data = await inviteStore.fetchInviteData(userId)

    if (!data) {
      router.push({ name: 'not-found' })
      return
    }

    // Pre-load fonts
    const fontsToLoad = []
    if (data.user?.fontFamily) {
      fontsToLoad.push(data.user.fontFamily)
    }
    if (data.template?.fontFamily) {
      fontsToLoad.push(data.template.fontFamily)
    }
    // Load component-level fonts
    if (data.components) {
      data.components.forEach(comp => {
        if (comp.data?.fontFamily) {
          fontsToLoad.push(comp.data.fontFamily)
        }
      })
    }

    // Load all required fonts
    if (fontsToLoad.length > 0) {
      await loadFonts(fontsToLoad)
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading invite:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.component-wrapper {
  @apply mb-0;
}
</style>
