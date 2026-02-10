<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">템플릿 관리</h2>
      <button
        @click="createNewTemplate"
        class="btn-primary"
      >
        + 새 템플릿 만들기
      </button>
    </div>

    <!-- Template List View -->
    <div v-if="!editingTemplate" class="card">
      <div v-if="templateStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-accent mx-auto mb-4"></div>
        <p class="text-gray-600">로딩 중...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="template in templateStore.templates"
          :key="template.id"
          class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Template Preview -->
          <div
            class="aspect-[3/4] relative cursor-pointer"
            :style="{
              backgroundColor: template.backgroundColor || '#F5F5F5',
              backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
            @click="previewTemplate(template)"
          >
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
              <span class="text-white opacity-0 hover:opacity-100 font-semibold">클릭하여 미리보기</span>
            </div>
            <!-- Mini preview of components -->
            <div class="p-2 space-y-1">
              <div
                v-for="comp in template.components.slice(0, 3)"
                :key="comp.id"
                class="bg-white bg-opacity-70 rounded p-1 text-xs text-gray-700"
              >
                {{ getComponentTypeName(comp.type) }}
              </div>
            </div>
          </div>

          <!-- Template Info -->
          <div class="p-4 bg-white">
            <h3 class="font-bold text-lg mb-2">{{ template.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">
              {{ template.components.length }}개의 컴포넌트
            </p>
            <div class="flex gap-2">
              <button
                @click="editTemplate(template)"
                class="btn-primary text-sm flex-1"
              >
                편집
              </button>
              <button
                @click="previewTemplate(template)"
                class="btn-secondary text-sm"
              >
                미리보기
              </button>
              <button
                @click="deleteTemplate(template.id)"
                class="text-red-600 hover:text-red-800 px-3"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Builder View -->
    <div v-else>
      <div class="mb-4 flex items-center gap-4">
        <button
          @click="cancelEdit"
          class="text-gray-600 hover:text-gray-800"
        >
          ← 목록으로
        </button>
        <div class="flex-1">
          <input
            v-model="editingTemplate.name"
            type="text"
            class="input-field text-xl font-bold"
            placeholder="템플릿 이름"
          />
        </div>
      </div>

      <TemplateBuilder
        :initial-template="editingTemplate"
        @save="handleSaveTemplate"
      />
    </div>

    <!-- Preview Modal -->
    <div
      v-if="previewingTemplate"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      @click.self="closePreview"
    >
      <div class="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button
          @click="closePreview"
          class="absolute top-4 right-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
        >
          ✕
        </button>

        <div
          class="bg-white rounded-lg shadow-2xl"
          :style="{
            backgroundColor: previewingTemplate.backgroundColor || '#FFFFFF',
            backgroundImage: previewingTemplate.backgroundImage ? `url(${previewingTemplate.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        >
          <!-- Preview Content -->
          <div class="relative min-h-screen">
            <div
              v-for="component in sortedPreviewComponents"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTemplateStore } from '@/stores/templateStore'
import TemplateBuilder from '@/components/admin/TemplateBuilder.vue'
import InviteText from '@/components/invite/InviteText.vue'
import InviteGallery from '@/components/invite/InviteGallery.vue'
import InviteHyperlink from '@/components/invite/InviteHyperlink.vue'
import InviteMap from '@/components/invite/InviteMap.vue'

const templateStore = useTemplateStore()

const editingTemplate = ref(null)
const previewingTemplate = ref(null)

const sortedPreviewComponents = computed(() => {
  if (!previewingTemplate.value) return []
  return [...previewingTemplate.value.components].sort((a, b) => a.order - b.order)
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

const createNewTemplate = () => {
  editingTemplate.value = {
    id: null,
    name: '새 템플릿',
    thumbnail: '',
    category: 'custom',
    backgroundColor: '#FFFFFF',
    backgroundImage: null,
    components: []
  }
}

const editTemplate = (template) => {
  editingTemplate.value = JSON.parse(JSON.stringify(template))
}

const cancelEdit = () => {
  if (confirm('편집 중인 내용이 저장되지 않을 수 있습니다. 계속하시겠습니까?')) {
    editingTemplate.value = null
  }
}

const handleSaveTemplate = async (template) => {
  try {
    if (template.id) {
      await templateStore.updateTemplate(template.id, template)
    } else {
      await templateStore.createTemplate(template)
    }
    editingTemplate.value = null
  } catch (error) {
    alert('저장 중 오류가 발생했습니다: ' + error.message)
  }
}

const deleteTemplate = async (templateId) => {
  if (confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
    try {
      await templateStore.deleteTemplate(templateId)
      alert('템플릿이 삭제되었습니다.')
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message)
    }
  }
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
}

const closePreview = () => {
  previewingTemplate.value = null
}

onMounted(async () => {
  await templateStore.fetchTemplates()
})
</script>
