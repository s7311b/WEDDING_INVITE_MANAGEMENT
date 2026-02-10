import config from '@/config'
import { mockService } from './mockService'
import { apiService } from './apiService'

// 설정에 따라 데이터 서비스 선택
const dataService = config.USE_DATABASE ? apiService : mockService

// 현재 사용 중인 데이터 소스 확인
export const getDataSourceInfo = () => {
  return {
    type: config.USE_DATABASE ? 'SQLite Database' : 'Mock Data (localStorage)',
    useDatabase: config.USE_DATABASE,
    apiUrl: config.API_URL
  }
}

export default dataService
