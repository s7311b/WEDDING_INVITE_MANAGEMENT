// 데이터 소스 설정
export const config = {
  // true: SQLite DB 사용, false: Mock 데이터(localStorage) 사용
  USE_DATABASE: import.meta.env.VITE_USE_DATABASE === 'true',

  // API 서버 URL (USE_DATABASE가 true일 때 사용)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
}

export default config
