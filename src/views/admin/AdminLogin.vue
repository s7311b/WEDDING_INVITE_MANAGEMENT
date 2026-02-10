<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-primary to-wedding-secondary">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-wedding-accent mb-2">Wedding Invite</h1>
        <h2 class="text-xl text-gray-600">관리자 로그인</h2>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input-field w-full"
            placeholder="관리자 비밀번호를 입력하세요"
            required
          />
        </div>

        <div v-if="errorMessage" class="mb-4 text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <p>개발 환경 기본 비밀번호: admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = () => {
  errorMessage.value = ''
  loading.value = true

  setTimeout(() => {
    const success = authStore.login(password.value)

    if (success) {
      router.push({ name: 'admin-dashboard' })
    } else {
      errorMessage.value = '비밀번호가 올바르지 않습니다.'
      password.value = ''
    }

    loading.value = false
  }, 500)
}
</script>
