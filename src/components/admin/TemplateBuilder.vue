<template>
  <div class="template-builder flex gap-6">
    <!-- Left: Component Palette (Sticky) -->
    <div class="w-80 flex-shrink-0">
      <div class="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <ComponentPalette
          :background-color="template.backgroundColor || '#FFFFFF'"
          :background-image="template.backgroundImage"
          :template-font-family="template.fontFamily || ''"
          @add-component="handleAddComponent"
          @update-background-color="handleUpdateBackgroundColor"
          @update-background-image="handleUpdateBackgroundImage"
          @update-template-font-family="handleUpdateTemplateFontFamily"
        />
      </div>
    </div>

    <!-- Center: Canvas -->
    <div class="flex-1">
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-gray-800">캔버스</h3>
            <div class="flex gap-2">
              <button
                @click="togglePreview"
                class="btn-secondary text-sm"
              >
                {{ showPreview ? '편집 모드' : '미리보기' }}
              </button>
              <button
                @click="saveTemplate"
                class="btn-primary text-sm"
                :disabled="saving"
              >
                {{ saving ? '저장 중...' : '저장' }}
              </button>
            </div>
          </div>

          <!-- Template Selector -->
          <div class="flex gap-2 items-center">
            <label class="text-sm font-medium text-gray-700">템플릿 불러오기:</label>
            <select
              v-model="selectedTemplateId"
              @change="loadSelectedTemplate"
              class="input-field flex-1 text-sm"
            >
              <option value="">-- 템플릿 선택 --</option>
              <option
                v-for="tmpl in availableTemplates"
                :key="tmpl.id"
                :value="tmpl.id"
              >
                {{ tmpl.name }}
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="!showPreview"
          class="canvas-container relative border-2 border-gray-300 rounded"
          :style="canvasStyle"
        >
          <Vue3DraggableResizable
            v-for="component in template.components"
            :key="component.id"
            :init-w="component.position?.width || 600"
            :init-h="component.position?.height || 200"
            :x="component.position?.x || 50"
            :y="component.position?.y || 50"
            :min-w="200"
            :min-h="100"
            :parent="true"
            :draggable="true"
            :resizable="true"
            @activated="selectComponent(component)"
            @drag-end="updateComponentPosition(component.id, $event)"
            @resize-end="updateComponentPosition(component.id, $event)"
          >
            <div
              class="component-wrapper h-full border-2 rounded"
              :class="{
                'border-wedding-accent bg-wedding-primary bg-opacity-20': selectedComponent?.id === component.id,
                'border-gray-300 bg-white bg-opacity-90': selectedComponent?.id !== component.id
              }"
            >
              <div class="h-full p-2 overflow-auto">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-gray-600">
                    {{ getComponentTypeName(component.type) }}
                  </span>
                  <button
                    @click.stop="deleteComponent(component.id)"
                    class="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <component
                  :is="getComponentPreview(component.type)"
                  :data="component.data"
                  :style="component.style"
                  class="pointer-events-none"
                />
              </div>
            </div>
          </Vue3DraggableResizable>

          <!-- Empty State -->
          <div
            v-if="template.components.length === 0"
            class="absolute inset-0 flex items-center justify-center text-gray-400"
          >
            <div class="text-center">
              <div class="text-4xl mb-2">📱</div>
              <p>왼쪽에서 컴포넌트를 추가하세요</p>
            </div>
          </div>
        </div>

        <!-- Preview Mode -->
        <div
          v-else
          class="canvas-container border-2 border-gray-300 rounded overflow-auto"
          :style="canvasStyle"
        >
          <div class="min-h-full relative">
            <div
              v-for="component in sortedComponents"
              :key="component.id"
              class="absolute"
              :style="getAbsoluteStyle(component)"
            >
              <component
                :is="getComponentPreview(component.type)"
                :data="component.data"
                :style="component.style"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Properties Panel (Sticky) -->
    <div class="w-80 flex-shrink-0">
      <div class="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-bold mb-4 text-gray-800">속성</h3>

        <div v-if="!selectedComponent" class="text-center py-8 text-gray-500">
          컴포넌트를 선택하세요
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              컴포넌트 타입
            </label>
            <input
              type="text"
              :value="getComponentTypeName(selectedComponent.type)"
              class="input-field w-full bg-gray-100"
              disabled
            />
          </div>

          <!-- Text Component Properties -->
          <template v-if="selectedComponent.type === 'text'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                v-model="selectedComponent.data.title"
                type="text"
                class="input-field w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                v-model="selectedComponent.data.content"
                class="input-field w-full"
                rows="4"
              />
            </div>
            <div>
              <FontSelector
                v-model="selectedComponent.data.fontFamily"
                label="폰트"
                :show-preview="false"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">폰트 크기</label>
              <input
                v-model="selectedComponent.data.fontSize"
                type="text"
                class="input-field w-full"
                placeholder="24px"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">텍스트 색상</label>
              <input
                v-model="selectedComponent.data.color"
                type="color"
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">정렬</label>
              <select v-model="selectedComponent.data.textAlign" class="input-field w-full">
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </div>
          </template>

          <!-- Gallery Component Properties -->
          <template v-if="selectedComponent.type === 'gallery'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">레이아웃</label>
              <select v-model="selectedComponent.data.layout" class="input-field w-full">
                <option value="1x1">1x1</option>
                <option value="2x1">2x1</option>
                <option value="2x2">2x2</option>
                <option value="3x1">3x1</option>
                <option value="3x3">3x3</option>
                <option value="4x1">4x1</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                이미지 URL (한 줄에 하나씩)
              </label>
              <textarea
                :value="selectedComponent.data.images.map(img => img.url).join('\n')"
                @input="updateGalleryImages($event.target.value)"
                class="input-field w-full"
                rows="4"
              />
            </div>
          </template>

          <!-- Hyperlink Component Properties -->
          <template v-if="selectedComponent.type === 'hyperlink'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">버튼 텍스트</label>
              <input
                v-model="selectedComponent.data.text"
                type="text"
                class="input-field w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
              <input
                v-model="selectedComponent.data.url"
                type="url"
                class="input-field w-full"
              />
            </div>
            <div>
              <FontSelector
                v-model="selectedComponent.data.fontFamily"
                label="폰트"
                :show-preview="false"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">버튼 스타일</label>
              <select v-model="selectedComponent.data.buttonStyle" class="input-field w-full">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="gold">Gold</option>
                <option value="rose">Rose</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">아이콘</label>
              <select v-model="selectedComponent.data.icon" class="input-field w-full">
                <option value="">없음</option>
                <option value="message">💌 메시지</option>
                <option value="heart">❤️ 하트</option>
                <option value="gift">🎁 선물</option>
                <option value="calendar">📅 캘린더</option>
                <option value="location">📍 위치</option>
                <option value="phone">📞 전화</option>
                <option value="camera">📷 카메라</option>
              </select>
            </div>
          </template>

          <!-- Map Component Properties -->
          <template v-if="selectedComponent.type === 'map'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">장소명</label>
              <input
                v-model="selectedComponent.data.placeName"
                type="text"
                class="input-field w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                v-model="selectedComponent.data.address"
                type="text"
                class="input-field w-full"
              />
            </div>
            <div>
              <FontSelector
                v-model="selectedComponent.data.fontFamily"
                label="폰트"
                :show-preview="false"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">위도</label>
              <input
                v-model.number="selectedComponent.data.latitude"
                type="number"
                step="0.0000001"
                class="input-field w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">경도</label>
              <input
                v-model.number="selectedComponent.data.longitude"
                type="number"
                step="0.0000001"
                class="input-field w-full"
              />
            </div>
          </template>

          <!-- Common Style Properties -->
          <div class="pt-4 border-t">
            <h4 class="font-semibold mb-2">스타일</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">배경색</label>
              <input
                v-model="selectedComponent.style.backgroundColor"
                type="color"
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import ComponentPalette from './ComponentPalette.vue'
import InviteText from '@/components/invite/InviteText.vue'
import InviteGallery from '@/components/invite/InviteGallery.vue'
import InviteHyperlink from '@/components/invite/InviteHyperlink.vue'
import InviteMap from '@/components/invite/InviteMap.vue'
import FontSelector from '@/components/common/FontSelector.vue'
import { findEmptySpace, resolveCollision } from '@/utils/collisionDetection'
import { useTemplateStore } from '@/stores/templateStore'

const props = defineProps({
  initialTemplate: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save'])

const templateStore = useTemplateStore()

const template = ref({
  ...props.initialTemplate,
  backgroundColor: props.initialTemplate.backgroundColor || '#FFFFFF',
  backgroundImage: props.initialTemplate.backgroundImage || null,
  components: [...(props.initialTemplate.components || [])]
})

const selectedComponent = ref(null)
const showPreview = ref(false)
const saving = ref(false)
const availableTemplates = ref([])
const selectedTemplateId = ref('')

const canvasStyle = computed(() => {
  const style = {
    width: '800px',
    minHeight: '1200px',
    position: 'relative'
  }

  if (template.value.backgroundImage) {
    style.backgroundImage = `url(${template.value.backgroundImage})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  } else {
    style.backgroundColor = template.value.backgroundColor
  }

  return style
})

const sortedComponents = computed(() => {
  return [...template.value.components].sort((a, b) => a.order - b.order)
})

const getComponentTypeName = (type) => {
  const names = {
    text: '텍스트',
    gallery: '갤러리',
    hyperlink: '버튼/링크',
    map: '지도'
  }
  return names[type] || type
}

const getComponentPreview = (type) => {
  const components = {
    text: InviteText,
    gallery: InviteGallery,
    hyperlink: InviteHyperlink,
    map: InviteMap
  }
  return components[type] || InviteText
}

const getAbsoluteStyle = (component) => {
  return {
    left: `${component.position?.x || 0}px`,
    top: `${component.position?.y || 0}px`,
    width: `${component.position?.width || 600}px`,
    height: `${component.position?.height || 200}px`
  }
}

const handleAddComponent = (component) => {
  // 충돌 감지 및 빈 공간 찾기 (높이 제한 제거)
  const canvasSize = { width: 800 }
  const componentWidth = component.position?.width || 600
  const componentHeight = component.position?.height || 200

  // component.data에 width와 height 설정 (collision detection에서 필요)
  if (!component.data) {
    component.data = {}
  }
  component.data.width = componentWidth
  component.data.height = componentHeight

  const emptySpace = findEmptySpace(
    componentWidth,
    componentHeight,
    template.value.components,
    canvasSize
  )

  if (emptySpace) {
    component.position = {
      x: emptySpace.x,
      y: emptySpace.y,
      width: componentWidth,
      height: componentHeight
    }
    console.log(`New component placed at (${emptySpace.x}, ${emptySpace.y})`)
  } else {
    console.warn('No empty space found, using default position')
    component.position = {
      x: component.position?.x || 50,
      y: component.position?.y || 50,
      width: componentWidth,
      height: componentHeight
    }
  }

  template.value.components.push(component)
  selectedComponent.value = component
}

const handleUpdateBackgroundColor = (color) => {
  template.value.backgroundColor = color
  template.value.backgroundImage = null
}

const handleUpdateBackgroundImage = (image) => {
  template.value.backgroundImage = image
}

const handleUpdateTemplateFontFamily = (fontFamily) => {
  template.value.fontFamily = fontFamily
}

const selectComponent = (component) => {
  selectedComponent.value = component
}

const updateComponentPosition = (componentId, position) => {
  const component = template.value.components.find(c => c.id === componentId)
  if (component) {
    // 충돌 감지 및 자동 해결 (높이 제한 제거)
    const canvasSize = { width: 800 }

    // component.data가 없으면 초기화
    if (!component.data) {
      component.data = {}
    }

    component.data.width = position.width
    component.data.height = position.height

    const adjustedPosition = resolveCollision(
      component,
      { x: position.x, y: position.y },
      template.value.components,
      canvasSize
    )

    component.position = {
      x: adjustedPosition.x,
      y: adjustedPosition.y,
      width: position.width,
      height: position.height
    }

    if (adjustedPosition.adjusted) {
      // 위치가 조정된 경우 사용자에게 알림
      console.log(`Position adjusted due to collision`)
    }
  }
}

const deleteComponent = (componentId) => {
  if (confirm('이 컴포넌트를 삭제하시겠습니까?')) {
    template.value.components = template.value.components.filter(c => c.id !== componentId)
    if (selectedComponent.value?.id === componentId) {
      selectedComponent.value = null
    }
  }
}

const updateGalleryImages = (value) => {
  if (selectedComponent.value && selectedComponent.value.type === 'gallery') {
    const urls = value.split('\n').filter(url => url.trim())
    selectedComponent.value.data.images = urls.map((url, index) => ({
      url: url.trim(),
      alt: `사진${index + 1}`
    }))
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const saveTemplate = async () => {
  saving.value = true
  try {
    // Update order based on y position
    template.value.components.forEach((comp, index) => {
      comp.order = index + 1
    })

    await new Promise(resolve => setTimeout(resolve, 500))
    emit('save', template.value)
    alert('템플릿이 저장되었습니다.')
  } catch (error) {
    alert('저장 중 오류가 발생했습니다: ' + error.message)
  } finally {
    saving.value = false
  }
}

const loadSelectedTemplate = async () => {
  if (!selectedTemplateId.value) {
    return
  }

  // 작업 중 경고
  if (template.value.components.length > 0 || template.value.backgroundColor !== '#FFFFFF') {
    const confirmed = confirm(
      '현재 작업 중인 내용이 있습니다.\n템플릿을 불러오면 현재 내용이 덮어써집니다.\n계속하시겠습니까?'
    )
    if (!confirmed) {
      selectedTemplateId.value = ''
      return
    }
  }

  try {
    const selectedTemplate = availableTemplates.value.find(
      tmpl => tmpl.id === selectedTemplateId.value
    )

    if (selectedTemplate) {
      // Deep copy하여 적용
      template.value = {
        ...selectedTemplate,
        backgroundColor: selectedTemplate.backgroundColor || '#FFFFFF',
        backgroundImage: selectedTemplate.backgroundImage || null,
        components: JSON.parse(JSON.stringify(selectedTemplate.components || []))
      }

      selectedComponent.value = null
      console.log(`Template loaded: ${selectedTemplate.name}`)
    }
  } catch (error) {
    console.error('Failed to load template:', error)
    alert('템플릿을 불러오는 중 오류가 발생했습니다.')
  }
}

// Watch for prop changes
watch(() => props.initialTemplate, (newVal) => {
  template.value = {
    ...newVal,
    backgroundColor: newVal.backgroundColor || '#FFFFFF',
    backgroundImage: newVal.backgroundImage || null,
    components: [...(newVal.components || [])]
  }
}, { deep: true })

// Fetch templates on mount
onMounted(async () => {
  try {
    await templateStore.fetchTemplates()
    availableTemplates.value = templateStore.templates
  } catch (error) {
    console.error('Failed to fetch templates:', error)
  }
})
</script>

<style scoped>
.canvas-container {
  margin: 0 auto;
}

.component-wrapper {
  cursor: move;
  user-select: none;
}

:deep(.vdr-container) {
  z-index: 1;
}

:deep(.vdr-container.active) {
  z-index: 10;
}
</style>
