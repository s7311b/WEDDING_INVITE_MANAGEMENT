<template>
  <div class="component-palette bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-bold mb-4 text-gray-800">컴포넌트</h3>

    <div class="space-y-2">
      <button
        v-for="componentType in componentTypes"
        :key="componentType.type"
        @click="addComponent(componentType)"
        class="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-wedding-accent hover:bg-wedding-primary transition-all text-left"
      >
        <div class="flex items-center">
          <span class="text-2xl mr-3">{{ componentType.icon }}</span>
          <div>
            <div class="font-semibold">{{ componentType.name }}</div>
            <div class="text-xs text-gray-500">{{ componentType.description }}</div>
          </div>
        </div>
      </button>
    </div>

    <div class="mt-6 pt-6 border-t">
      <h4 class="font-semibold mb-3 text-gray-800">배경 설정</h4>

      <!-- Color Picker -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">배경 색상</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="backgroundColor"
            @input="updateBackgroundColor($event.target.value)"
            class="w-12 h-12 rounded cursor-pointer"
          />
          <input
            type="text"
            :value="backgroundColor"
            @input="updateBackgroundColor($event.target.value)"
            class="input-field flex-1"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      <!-- Preset Colors -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">프리셋 색상</label>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="color in presetColors"
            :key="color"
            @click="updateBackgroundColor(color)"
            :style="{ backgroundColor: color }"
            class="w-10 h-10 rounded border-2 hover:border-wedding-accent transition-colors"
            :class="{ 'border-wedding-accent ring-2 ring-wedding-accent': backgroundColor === color }"
          />
        </div>
      </div>

      <!-- Background Images -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="updateBackgroundImage(null)"
            class="aspect-square border-2 rounded hover:border-wedding-accent transition-colors flex items-center justify-center text-xs"
            :class="{ 'border-wedding-accent ring-2 ring-wedding-accent': !backgroundImage }"
          >
            없음
          </button>
          <button
            v-for="(image, index) in backgroundImages"
            :key="index"
            @click="updateBackgroundImage(image)"
            class="aspect-square border-2 rounded hover:border-wedding-accent transition-colors overflow-hidden"
            :class="{ 'border-wedding-accent ring-2 ring-wedding-accent': backgroundImage === image }"
          >
            <img :src="image" alt="Background" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  backgroundImage: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['add-component', 'update-background-color', 'update-background-image'])

const componentTypes = [
  {
    type: 'text',
    name: '텍스트',
    icon: '📝',
    description: '제목 및 본문',
    defaultData: {
      title: '제목을 입력하세요',
      content: '내용을 입력하세요',
      fontSize: '24px',
      textAlign: 'center',
      color: '#333333'
    },
    defaultStyle: {
      padding: '40px 20px',
      backgroundColor: 'transparent'
    }
  },
  {
    type: 'gallery',
    name: '갤러리',
    icon: '🖼️',
    description: '이미지 갤러리',
    defaultData: {
      layout: '2x2',
      images: [
        { url: 'https://via.placeholder.com/400x400/D4A5A5/FFFFFF?text=Photo+1', alt: '사진1' },
        { url: 'https://via.placeholder.com/400x400/E8D5D5/FFFFFF?text=Photo+2', alt: '사진2' }
      ]
    },
    defaultStyle: {
      padding: '20px'
    }
  },
  {
    type: 'hyperlink',
    name: '버튼/링크',
    icon: '🔗',
    description: '외부 링크 버튼',
    defaultData: {
      text: '버튼 텍스트',
      url: 'https://example.com',
      buttonStyle: 'primary',
      icon: 'heart'
    },
    defaultStyle: {
      padding: '20px',
      textAlign: 'center'
    }
  },
  {
    type: 'map',
    name: '지도',
    icon: '📍',
    description: '카카오 지도',
    defaultData: {
      address: '서울특별시 강남구 테헤란로 123',
      placeName: '웨딩홀 이름',
      latitude: 37.5012743,
      longitude: 127.0396597
    },
    defaultStyle: {
      padding: '20px',
      height: '400px'
    }
  }
]

const presetColors = [
  '#FFFFFF',
  '#F8E8E8',
  '#E8D5D5',
  '#D4A5A5',
  '#FFB6C1',
  '#FFF8DC',
  '#F0E68C',
  '#E6E6FA',
  '#B0E0E6',
  '#F5F5DC',
  '#FAF0E6',
  '#000000'
]

const backgroundImages = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
  'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800'
]

const addComponent = (componentType) => {
  const newComponent = {
    id: `comp-${Date.now()}`,
    type: componentType.type,
    order: 0,
    data: { ...componentType.defaultData },
    style: { ...componentType.defaultStyle },
    position: {
      x: 50,
      y: 50,
      width: 600,
      height: 200
    }
  }
  emit('add-component', newComponent)
}

const updateBackgroundColor = (color) => {
  emit('update-background-color', color)
}

const updateBackgroundImage = (image) => {
  emit('update-background-image', image)
}
</script>
