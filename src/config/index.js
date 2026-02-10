// 데이터 소스 설정
export const config = {
  // true: SQLite DB 사용, false: Mock 데이터(localStorage) 사용
  USE_DATABASE: import.meta.env.VITE_USE_DATABASE === 'true',

  // API 서버 URL (USE_DATABASE가 true일 때 사용)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
}

// Favicon 설정
export const FAVICON_OPTIONS = {
  BRIDE_GROOM: 'bride-groom',
  WEDDING_CARD: 'wedding-card',
  BOUQUET: 'bouquet'
}

export const FAVICON_TYPE = FAVICON_OPTIONS.BRIDE_GROOM // 기본값

// Favicon 업데이트 함수
export function updateFavicon(type = FAVICON_TYPE) {
  const faviconPath = `/favicons/${type}.svg`

  // 기존 favicon 링크 찾기 또는 생성
  let link = document.querySelector("link[rel*='icon']")

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.type = 'image/svg+xml'
  link.href = faviconPath

  console.log(`Favicon updated to: ${type}`)
}

export default config
