<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">데이터 소스 설정</h2>
    <p class="text-sm text-gray-600 mb-4">
      애플리케이션에서 사용할 데이터 소스를 선택하세요.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        @click="selectDataSource(false)"
        class="p-6 border-2 rounded-lg transition-all hover:shadow-md text-left"
        :class="{
          'border-wedding-secondary bg-wedding-primary': !configStore.useDatabase,
          'border-gray-300 hover:border-wedding-secondary': configStore.useDatabase
        }"
      >
        <div class="flex items-start">
          <div
            class="w-5 h-5 rounded-full border-2 mr-3 mt-1 flex items-center justify-center"
            :class="{
              'border-wedding-secondary bg-wedding-secondary': !configStore.useDatabase,
              'border-gray-400': configStore.useDatabase
            }"
          >
            <div
              v-if="!configStore.useDatabase"
              class="w-2 h-2 rounded-full bg-white"
            ></div>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-1">Mock Data</h3>
            <p class="text-sm text-gray-600">
              로컬 스토리지 기반 샘플 데이터 사용 (개발/테스트용)
            </p>
          </div>
        </div>
      </button>

      <button
        @click="selectDataSource(true)"
        class="p-6 border-2 rounded-lg transition-all hover:shadow-md text-left"
        :class="{
          'border-wedding-secondary bg-wedding-primary': configStore.useDatabase,
          'border-gray-300 hover:border-wedding-secondary': !configStore.useDatabase
        }"
      >
        <div class="flex items-start">
          <div
            class="w-5 h-5 rounded-full border-2 mr-3 mt-1 flex items-center justify-center"
            :class="{
              'border-wedding-secondary bg-wedding-secondary': configStore.useDatabase,
              'border-gray-400': !configStore.useDatabase
            }"
          >
            <div
              v-if="configStore.useDatabase"
              class="w-2 h-2 rounded-full bg-white"
            ></div>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-1">SQLite Database</h3>
            <p class="text-sm text-gray-600">
              서버 데이터베이스 사용 (프로덕션용)
            </p>
          </div>
        </div>
      </button>
    </div>

    <div class="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
      <strong>현재 데이터 소스:</strong> {{ currentDataSource }}
    </div>

    <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
      <strong>주의:</strong> 데이터 소스 변경 후 페이지를 새로고침하면 변경사항이 적용됩니다.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const currentDataSource = computed(() => {
  return configStore.useDatabase ? 'SQLite Database' : 'Mock Data (localStorage)'
})

const selectDataSource = (useDatabase) => {
  if (configStore.useDatabase !== useDatabase) {
    const confirmMessage = useDatabase
      ? 'SQLite Database로 전환하시겠습니까?\n\n서버가 실행 중이어야 하며, 페이지가 새로고침됩니다.'
      : 'Mock Data로 전환하시겠습니까?\n\n로컬 스토리지의 샘플 데이터를 사용하며, 페이지가 새로고침됩니다.'

    if (confirm(confirmMessage)) {
      configStore.setDataSource(useDatabase)
      // 페이지 새로고침하여 변경사항 적용
      window.location.reload()
    }
  }
}
</script>
