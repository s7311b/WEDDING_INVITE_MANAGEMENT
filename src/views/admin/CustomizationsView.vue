<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">사용자별 커스터마이징</h2>
      <div v-if="!selectedUser" class="text-sm text-gray-500">
        사용자를 선택하여 시작하세요
      </div>
      <button
        v-else
        @click="backToUserList"
        class="btn-secondary"
      >
        ← 사용자 목록으로
      </button>
    </div>

    <!-- User Selection View -->
    <div v-if="!selectedUser" class="card">
      <h3 class="text-xl font-bold mb-4">사용자 선택</h3>

      <div v-if="userStore.loading" class="text-center py-8">
        <p class="text-gray-600">로딩 중...</p>
      </div>

      <div v-else-if="userStore.users.length === 0" class="text-center py-8">
        <p class="text-gray-500">등록된 사용자가 없습니다.</p>
        <RouterLink to="/admin/users" class="text-wedding-accent hover:underline mt-2 inline-block">
          사용자 추가하기 →
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="user in userStore.users"
          :key="user.id"
          @click="selectUser(user)"
          class="p-6 text-left border-2 rounded-lg hover:border-wedding-accent hover:bg-wedding-primary transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="font-bold text-lg">{{ user.name }}</div>
            <span
              class="px-2 py-1 rounded text-xs"
              :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ user.isActive ? '활성' : '비활성' }}
            </span>
          </div>
          <div class="text-sm text-gray-600 space-y-1">
            <div>📧 {{ user.email }}</div>
            <div>📅 {{ formatDate(user.weddingDate) }}</div>
            <div v-if="user.templateId" class="text-wedding-accent">
              템플릿: {{ getTemplateName(user.templateId) }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Customization Editor View -->
    <div v-else>
      <div class="mb-4 card">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold">{{ selectedUser.name }}님의 청첩장 편집</h3>
            <p class="text-sm text-gray-600 mt-1">
              📧 {{ selectedUser.email }} | 📅 {{ formatDate(selectedUser.weddingDate) }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="showTemplateSelector = true"
              class="btn-secondary"
            >
              📋 템플릿 불러오기
            </button>
            <a
              :href="`/invite/${selectedUser.id}`"
              target="_blank"
              class="btn-secondary"
            >
              👁️ 미리보기
            </a>
          </div>
        </div>
      </div>

      <TemplateBuilder
        v-if="currentCustomization"
        :initial-template="currentCustomization"
        @save="handleSaveCustomization"
      />
    </div>

    <!-- Template Selector Modal -->
    <div
      v-if="showTemplateSelector"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="showTemplateSelector = false"
    >
      <div class="card max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold">템플릿 불러오기</h3>
          <button
            @click="showTemplateSelector = false"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div v-if="templateStore.loading" class="text-center py-8">
          <p class="text-gray-600">로딩 중...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 빈 캔버스 옵션 -->
          <button
            @click="loadBlankCanvas"
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-wedding-accent hover:bg-wedding-primary transition-all text-center"
          >
            <div class="text-4xl mb-2">📄</div>
            <div class="font-bold">빈 캔버스</div>
            <div class="text-sm text-gray-600 mt-2">처음부터 새로 만들기</div>
          </button>

          <!-- 템플릿 목록 -->
          <button
            v-for="template in templateStore.templates"
            :key="template.id"
            @click="loadTemplate(template)"
            class="border-2 rounded-lg overflow-hidden hover:border-wedding-accent hover:shadow-lg transition-all text-left"
          >
            <div
              class="aspect-[3/4] relative"
              :style="{
                backgroundColor: template.backgroundColor || '#F5F5F5',
                backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }"
            >
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
              <div class="p-2 space-y-1">
                <div
                  v-for="comp in template.components.slice(0, 2)"
                  :key="comp.id"
                  class="bg-white bg-opacity-70 rounded p-1 text-xs"
                >
                  {{ getComponentTypeName(comp.type) }}
                </div>
              </div>
            </div>
            <div class="p-3 bg-white">
              <div class="font-bold">{{ template.name }}</div>
              <div class="text-xs text-gray-600">
                {{ template.components.length }}개 컴포넌트
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useInviteStore } from '@/stores/inviteStore'
import TemplateBuilder from '@/components/admin/TemplateBuilder.vue'
import dayjs from 'dayjs'

const userStore = useUserStore()
const templateStore = useTemplateStore()
const inviteStore = useInviteStore()

const selectedUser = ref(null)
const currentCustomization = ref(null)
const showTemplateSelector = ref(false)

const formatDate = (date) => {
  return dayjs(date).format('YYYY년 MM월 DD일')
}

const getTemplateName = (templateId) => {
  const template = templateStore.templates.find(t => t.id === templateId)
  return template ? template.name : '없음'
}

const getComponentTypeName = (type) => {
  const names = {
    text: '텍스트',
    gallery: '갤러리',
    hyperlink: '버튼/링크',
    map: '지도'
  }
  return names[type] || type
}

const selectUser = async (user) => {
  selectedUser.value = user

  // Load existing customization or create new one
  const customization = await inviteStore.getCustomizationByUserId(user.id)

  if (customization) {
    // User has customization
    currentCustomization.value = {
      id: customization.templateId,
      name: `${user.name}님의 청첩장`,
      components: customization.components || [],
      backgroundColor: customization.backgroundColor || '#FFFFFF',
      backgroundImage: customization.backgroundImage || null
    }
  } else if (user.templateId) {
    // Load from template
    const template = await templateStore.getTemplateById(user.templateId)
    if (template) {
      currentCustomization.value = {
        ...template,
        id: template.id,
        name: `${user.name}님의 청첩장`,
        components: JSON.parse(JSON.stringify(template.components))
      }
    } else {
      // Blank canvas
      currentCustomization.value = createBlankCanvas()
    }
  } else {
    // Blank canvas
    currentCustomization.value = createBlankCanvas()
  }
}

const createBlankCanvas = () => {
  return {
    id: null,
    name: selectedUser.value ? `${selectedUser.value.name}님의 청첩장` : '새 청첩장',
    components: [],
    backgroundColor: '#FFFFFF',
    backgroundImage: null
  }
}

const loadBlankCanvas = () => {
  currentCustomization.value = createBlankCanvas()
  showTemplateSelector.value = false
}

const loadTemplate = (template) => {
  currentCustomization.value = {
    ...template,
    name: `${selectedUser.value.name}님의 청첩장`,
    components: JSON.parse(JSON.stringify(template.components))
  }
  showTemplateSelector.value = false
}

const handleSaveCustomization = async (customization) => {
  if (!selectedUser.value) return

  try {
    await inviteStore.saveCustomization(selectedUser.value.id, {
      templateId: customization.id || null,
      components: customization.components,
      backgroundColor: customization.backgroundColor,
      backgroundImage: customization.backgroundImage
    })

    // Update user's templateId if not set
    if (!selectedUser.value.templateId && customization.id) {
      await userStore.updateUser(selectedUser.value.id, {
        ...selectedUser.value,
        templateId: customization.id
      })
    }

    alert('커스터마이징이 저장되었습니다!')
  } catch (error) {
    alert('저장 중 오류가 발생했습니다: ' + error.message)
  }
}

const backToUserList = () => {
  if (confirm('편집 중인 내용이 저장되지 않을 수 있습니다. 계속하시겠습니까?')) {
    selectedUser.value = null
    currentCustomization.value = null
  }
}

onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    templateStore.fetchTemplates()
  ])
})
</script>
