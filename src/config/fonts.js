/**
 * 웨딩 초대장에 사용 가능한 폰트 목록
 * Google Fonts API를 통해 로드
 */

export const availableFonts = [
  // 한글 폰트 (10개)
  {
    id: 'noto-serif-kr',
    family: 'Noto Serif KR',
    name: 'Noto Serif KR (고딕체)',
    language: 'korean',
    weights: [300, 400, 500, 700],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&display=swap'
  },
  {
    id: 'nanum-myeongjo',
    family: 'Nanum Myeongjo',
    name: '나눔명조',
    language: 'korean',
    weights: [400, 700, 800],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap'
  },
  {
    id: 'nanum-gothic',
    family: 'Nanum Gothic',
    name: '나눔고딕',
    language: 'korean',
    weights: [400, 700, 800],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap'
  },
  {
    id: 'nanum-pen-script',
    family: 'Nanum Pen Script',
    name: '나눔손글씨 펜',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap'
  },
  {
    id: 'cute-font',
    family: 'Cute Font',
    name: '큐트 폰트',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cute+Font&display=swap'
  },
  {
    id: 'do-hyeon',
    family: 'Do Hyeon',
    name: '도현체',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap'
  },
  {
    id: 'jua',
    family: 'Jua',
    name: '주아체',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Jua&display=swap'
  },
  {
    id: 'gamja-flower',
    family: 'Gamja Flower',
    name: '감자꽃',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap'
  },
  {
    id: 'stylish',
    family: 'Stylish',
    name: '스타일리시',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Stylish&display=swap'
  },
  {
    id: 'black-han-sans',
    family: 'Black Han Sans',
    name: '검은고딕',
    language: 'korean',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'
  },

  // 영문 폰트 (5개)
  {
    id: 'playfair-display',
    family: 'Playfair Display',
    name: 'Playfair Display (우아한)',
    language: 'english',
    weights: [400, 500, 600, 700, 800, 900],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap'
  },
  {
    id: 'great-vibes',
    family: 'Great Vibes',
    name: 'Great Vibes (필기체)',
    language: 'english',
    weights: [400],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'
  },
  {
    id: 'dancing-script',
    family: 'Dancing Script',
    name: 'Dancing Script (댄싱)',
    language: 'english',
    weights: [400, 500, 600, 700],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap'
  },
  {
    id: 'cinzel',
    family: 'Cinzel',
    name: 'Cinzel (클래식)',
    language: 'english',
    weights: [400, 500, 600, 700, 800, 900],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap'
  },
  {
    id: 'cormorant-garamond',
    family: 'Cormorant Garamond',
    name: 'Cormorant Garamond (세리프)',
    language: 'english',
    weights: [300, 400, 500, 600, 700],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap'
  }
]

// 기본 폰트
export const defaultFont = availableFonts.find(font => font.id === 'noto-serif-kr')

/**
 * ID로 폰트 찾기
 * @param {string} fontId
 * @returns {Object|null}
 */
export function getFontById(fontId) {
  return availableFonts.find(font => font.id === fontId) || null
}

/**
 * Family 이름으로 폰트 찾기
 * @param {string} fontFamily
 * @returns {Object|null}
 */
export function getFontByFamily(fontFamily) {
  return availableFonts.find(font => font.family === fontFamily) || null
}

/**
 * 언어별 폰트 목록 가져오기
 * @param {string} language - 'korean' | 'english'
 * @returns {Array}
 */
export function getFontsByLanguage(language) {
  return availableFonts.filter(font => font.language === language)
}
