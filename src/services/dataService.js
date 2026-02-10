import { mockService } from './mockService'
import { apiService } from './apiService'

const CONFIG_STORAGE_KEY = 'wedding_invite_config'

// localStorage에서 데이터 소스 설정 가져오기
function getUseDatabase() {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (stored) {
      const config = JSON.parse(stored)
      return config.useDatabase ?? false
    }
  } catch (error) {
    console.error('Failed to read config from localStorage:', error)
  }
  return false
}

// Proxy 패턴으로 동적 서비스 선택
const dataServiceProxy = new Proxy({}, {
  get(target, prop) {
    const useDatabase = getUseDatabase()
    const service = useDatabase ? apiService : mockService

    // 함수인 경우 바인딩하여 반환
    if (typeof service[prop] === 'function') {
      return service[prop].bind(service)
    }

    return service[prop]
  }
})

// 현재 사용 중인 데이터 소스 확인
export const getDataSourceInfo = () => {
  const useDatabase = getUseDatabase()
  return {
    type: useDatabase ? 'SQLite Database' : 'Mock Data (localStorage)',
    useDatabase: useDatabase,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  }
}

export default dataServiceProxy
