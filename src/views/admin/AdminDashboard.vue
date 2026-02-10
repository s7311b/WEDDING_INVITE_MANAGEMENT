<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">대시보드</h2>
      <div class="text-sm">
        <span class="text-gray-600">데이터 소스:</span>
        <span
          class="ml-2 px-3 py-1 rounded-full text-xs font-semibold"
          :class="dataSourceInfo.useDatabase ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
        >
          {{ dataSourceInfo.type }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Users Card -->
      <div class="card bg-gradient-to-br from-wedding-accent to-wedding-secondary text-white">
        <h3 class="text-lg font-semibold mb-2">총 사용자</h3>
        <p class="text-4xl font-bold">{{ stats.totalUsers }}</p>
      </div>

      <!-- Active Users Card -->
      <div class="card bg-gradient-to-br from-green-400 to-green-600 text-white">
        <h3 class="text-lg font-semibold mb-2">활성 사용자</h3>
        <p class="text-4xl font-bold">{{ stats.activeUsers }}</p>
      </div>

      <!-- Total Templates Card -->
      <div class="card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
        <h3 class="text-lg font-semibold mb-2">총 템플릿</h3>
        <p class="text-4xl font-bold">{{ stats.totalTemplates }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <div class="card">
        <h3 class="text-xl font-bold mb-4 text-gray-800">최근 사용자</h3>
        <div v-if="loading" class="text-center py-4">
          <p class="text-gray-500">로딩 중...</p>
        </div>
        <div v-else-if="recentUsers.length === 0" class="text-center py-4">
          <p class="text-gray-500">사용자가 없습니다.</p>
        </div>
        <ul v-else class="space-y-3">
          <li
            v-for="user in recentUsers"
            :key="user.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="font-semibold">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ user.isActive ? '활성' : '비활성' }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-xl font-bold mb-4 text-gray-800">빠른 작업</h3>
        <div class="space-y-3">
          <RouterLink
            to="/admin/users"
            class="block p-4 bg-wedding-primary hover:bg-wedding-secondary rounded transition-colors text-center font-semibold"
          >
            사용자 관리
          </RouterLink>
          <RouterLink
            to="/admin/templates"
            class="block p-4 bg-wedding-primary hover:bg-wedding-secondary rounded transition-colors text-center font-semibold"
          >
            템플릿 관리
          </RouterLink>
          <RouterLink
            to="/admin/customizations"
            class="block p-4 bg-wedding-primary hover:bg-wedding-secondary rounded transition-colors text-center font-semibold"
          >
            커스터마이징
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTemplateStore } from '@/stores/templateStore'
import { getDataSourceInfo } from '@/services/dataService'

const userStore = useUserStore()
const templateStore = useTemplateStore()

const loading = ref(false)
const dataSourceInfo = getDataSourceInfo()

const stats = computed(() => ({
  totalUsers: userStore.users.length,
  activeUsers: userStore.users.filter(u => u.isActive).length,
  totalTemplates: templateStore.templates.length
}))

const recentUsers = computed(() => {
  return [...userStore.users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      userStore.fetchUsers(),
      templateStore.fetchTemplates()
    ])
  } finally {
    loading.value = false
  }
})
</script>
