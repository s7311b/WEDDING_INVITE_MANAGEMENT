<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-wedding-accent">Wedding Invite Management</h1>
        <button
          @click="handleLogout"
          class="btn-secondary"
        >
          로그아웃
        </button>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/admin"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-dashboard' }"
              >
                대시보드
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/users"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-users' }"
              >
                사용자 관리
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/templates"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-templates' }"
              >
                템플릿 관리
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/customizations"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-customizations' }"
              >
                커스터마이징
              </RouterLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>
