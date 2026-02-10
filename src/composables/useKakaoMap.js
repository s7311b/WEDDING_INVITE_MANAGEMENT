import { ref, onMounted } from 'vue'

export function useKakaoMap(mapContainerId, options = {}) {
  const map = ref(null)
  const marker = ref(null)
  const isLoaded = ref(false)
  const error = ref(null)

  const initMap = async () => {
    try {
      // Check if Kakao Maps SDK is loaded
      if (!window.kakao || !window.kakao.maps) {
        // Load Kakao Maps SDK
        await new Promise((resolve, reject) => {
          if (window.kakao && window.kakao.maps) {
            resolve()
            return
          }

          window.kakao.maps.load(() => {
            resolve()
          })
        })
      }

      const container = document.getElementById(mapContainerId)
      if (!container) {
        throw new Error('Map container not found')
      }

      const { latitude, longitude, level = 3 } = options

      const mapOptions = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: level
      }

      map.value = new window.kakao.maps.Map(container, mapOptions)

      // Add marker
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)
      marker.value = new window.kakao.maps.Marker({
        position: markerPosition
      })
      marker.value.setMap(map.value)

      isLoaded.value = true
    } catch (err) {
      error.value = err.message
      console.error('Error initializing Kakao Map:', err)
    }
  }

  const setCenter = (latitude, longitude) => {
    if (map.value) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude)
      map.value.setCenter(moveLatLon)

      if (marker.value) {
        marker.value.setPosition(moveLatLon)
      }
    }
  }

  const setLevel = (level) => {
    if (map.value) {
      map.value.setLevel(level)
    }
  }

  return {
    map,
    marker,
    isLoaded,
    error,
    initMap,
    setCenter,
    setLevel
  }
}
