<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">사용자 관리</h2>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        + 사용자 추가
      </button>
    </div>

    <UserManagement
      :show-create-modal="showCreateModal"
      @close-create-modal="showCreateModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserManagement from '@/components/admin/UserManagement.vue'

const showCreateModal = ref(false)
</script>
