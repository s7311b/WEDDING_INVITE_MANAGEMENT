<template>
  <div>
    <!-- User Table -->
    <div class="card">
      <div v-if="userStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-accent mx-auto mb-4"></div>
        <p class="text-gray-600">로딩 중...</p>
      </div>

      <div v-else-if="userStore.users.length === 0" class="text-center py-8">
        <p class="text-gray-500">등록된 사용자가 없습니다.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결혼일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in userStore.users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.weddingDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="handleToggleActive(user.id)"
                  class="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                  :class="user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                >
                  {{ user.isActive ? '활성' : '비활성' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a
                  :href="`/invite/${user.id}`"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900"
                >
                  보기
                </a>
                <button
                  @click="handleEdit(user)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  수정
                </button>
                <button
                  @click="handleDelete(user.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6">
          {{ showEditModal ? '사용자 수정' : '사용자 추가' }}
        </h3>

        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- ID Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">사용자 ID *</label>
              <input
                v-model="formData.id"
                type="text"
                class="input-field w-full"
                :class="{ 'bg-gray-100 cursor-not-allowed': showEditModal }"
                placeholder="user001"
                required
                pattern="[a-zA-Z0-9_-]+"
                title="영문자, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다"
                :readonly="showEditModal"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ showEditModal ? 'ID는 수정할 수 없습니다' : '영문자, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input
                v-model="formData.name"
                type="text"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
              <input
                v-model="formData.email"
                type="email"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
              <input
                v-model="formData.phone"
                type="tel"
                class="input-field w-full"
                placeholder="010-1234-5678"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">결혼일 *</label>
              <input
                v-model="formData.weddingDate"
                type="date"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">템플릿</label>
              <select
                v-model="formData.templateId"
                class="input-field w-full"
              >
                <option value="">템플릿 선택 (선택사항)</option>
                <option
                  v-for="template in templateStore.templates"
                  :key="template.id"
                  :value="template.id"
                >
                  {{ template.name }}
                </option>
              </select>
            </div>

            <div>
              <FontSelector
                v-model="formData.fontFamily"
                label="기본 폰트"
                :show-preview="false"
              />
              <p class="text-xs text-gray-500 mt-1">
                사용자 초대장 전체에 적용되는 기본 폰트입니다.
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="userStore.loading"
            >
              {{ userStore.loading ? '처리 중...' : (showEditModal ? '수정' : '추가') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTemplateStore } from '@/stores/templateStore'
import FontSelector from '@/components/common/FontSelector.vue'
import dayjs from 'dayjs'

const props = defineProps({
  showCreateModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close-create-modal'])

const userStore = useUserStore()
const templateStore = useTemplateStore()

const showEditModal = ref(false)
const editingUserId = ref(null)

const formData = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  weddingDate: '',
  templateId: '',
  fontFamily: ''
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.weddingDate = ''
  formData.templateId = ''
  formData.fontFamily = ''
}

const closeModal = () => {
  showEditModal.value = false
  editingUserId.value = null
  emit('close-create-modal')
  resetForm()
}

const handleSubmit = async () => {
  try {
    if (showEditModal.value && editingUserId.value) {
      await userStore.updateUser(editingUserId.value, formData)
      alert('사용자가 수정되었습니다.')
    } else {
      // 생성 모드: ID 중복 체크
      const existingUser = userStore.users.find(u => u.id === formData.id)
      if (existingUser) {
        alert(`이미 존재하는 사용자 ID입니다: ${formData.id}\n다른 ID를 사용해주세요.`)
        return
      }

      await userStore.createUser(formData)
      alert('사용자가 추가되었습니다.')
    }
    closeModal()
  } catch (error) {
    alert('오류가 발생했습니다: ' + error.message)
  }
}

const handleEdit = (user) => {
  editingUserId.value = user.id
  formData.id = user.id  // ID도 설정
  formData.name = user.name
  formData.email = user.email
  formData.phone = user.phone
  formData.weddingDate = user.weddingDate
  formData.templateId = user.templateId || ''
  formData.fontFamily = user.fontFamily || ''
  showEditModal.value = true
}

const handleDelete = async (userId) => {
  if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
    try {
      await userStore.deleteUser(userId)
      alert('사용자가 삭제되었습니다.')
    } catch (error) {
      alert('오류가 발생했습니다: ' + error.message)
    }
  }
}

const handleToggleActive = async (userId) => {
  try {
    await userStore.toggleUserActive(userId)
  } catch (error) {
    alert('오류가 발생했습니다: ' + error.message)
  }
}

watch(() => props.showCreateModal, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    templateStore.fetchTemplates()
  ])
})
</script>
