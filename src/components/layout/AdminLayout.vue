<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <!-- Mobile Menu Button -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="text-xl sm:text-2xl font-bold text-wedding-accent">Wedding Invite Management</h1>
        <button
          @click="handleLogout"
          class="btn-secondary text-sm sm:text-base"
        >
          로그아웃
        </button>
      </div>
    </header>

    <div class="flex relative">
      <!-- Overlay for mobile -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      ></div>

      <!-- Sidebar -->
      <aside
        class="fixed lg:static w-64 bg-white shadow-sm min-h-[calc(100vh-73px)] z-30 transition-transform duration-300 ease-in-out"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/admin"
                @click="closeSidebarOnMobile"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-dashboard' }"
              >
                대시보드
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/users"
                @click="closeSidebarOnMobile"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-users' }"
              >
                사용자 관리
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/templates"
                @click="closeSidebarOnMobile"
                class="block px-4 py-2 rounded hover:bg-wedding-primary transition-colors"
                :class="{ 'bg-wedding-secondary text-white': $route.name === 'admin-templates' }"
              >
                템플릿 관리
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/customizations"
                @click="closeSidebarOnMobile"
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
      <main class="flex-1 p-4 sm:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'admin-login' })
}

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile when menu item is clicked
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}
</script>
