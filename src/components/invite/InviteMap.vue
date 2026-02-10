<template>
  <div
    class="invite-map"
    :style="props.style"
  >
    <div class="mb-4 text-center" :style="{ fontFamily: fontFamily }">
      <h3 class="text-xl font-bold mb-2">{{ data.placeName }}</h3>
      <p class="text-gray-600">{{ data.address }}</p>
    </div>

    <div
      :id="mapId"
      class="w-full rounded shadow"
      :style="{ height: mapHeight }"
    />

    <div v-if="error" class="mt-4 text-center text-red-600">
      <p>지도를 불러올 수 없습니다.</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <div class="mt-4 flex justify-center gap-3">
      <a
        :href="kakaoMapUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="px-4 py-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition-colors"
      >
        카카오맵으로 길찾기
      </a>
      <a
        :href="naverMapUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        네이버맵으로 길찾기
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useKakaoMap } from '@/composables/useKakaoMap'
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

const mapId = computed(() => `map-${Math.random().toString(36).substr(2, 9)}`)
const mapHeight = computed(() => props.style.height || '400px')

const { isLoaded, error, initMap } = useKakaoMap(
  mapId.value,
  {
    latitude: props.data.latitude,
    longitude: props.data.longitude,
    level: 3
  }
)

const kakaoMapUrl = computed(() => {
  return `https://map.kakao.com/link/map/${props.data.placeName},${props.data.latitude},${props.data.longitude}`
})

const naverMapUrl = computed(() => {
  return `https://map.naver.com/v5/search/${encodeURIComponent(props.data.address)}`
})

onMounted(async () => {
  // Wait for the DOM to be ready
  await new Promise(resolve => setTimeout(resolve, 100))
  await initMap()
})
</script>
