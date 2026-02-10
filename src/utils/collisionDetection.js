/**
 * 충돌 감지 및 자동 배치 유틸리티
 */

/**
 * 두 사각형이 겹치는지 확인
 * @param {Object} rect1 - { x, y, width, height }
 * @param {Object} rect2 - { x, y, width, height }
 * @returns {boolean} 겹치면 true
 */
export function isOverlapping(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  )
}

/**
 * 컴포넌트가 다른 컴포넌트들과 충돌하는지 확인
 * @param {Object} component - 확인할 컴포넌트 { position: { x, y }, data: { width, height } }
 * @param {Array} components - 다른 컴포넌트들 배열
 * @param {string} excludeId - 제외할 컴포넌트 ID (자기 자신)
 * @returns {boolean} 충돌하면 true
 */
export function hasCollision(component, components, excludeId = null) {
  // 방어 코드: component나 components가 없으면 false 반환
  if (!component || !components || !Array.isArray(components)) {
    return false
  }

  // 방어 코드: position이나 data가 없으면 false 반환
  if (!component.position || !component.data) {
    return false
  }

  const rect1 = {
    x: component.position.x || 0,
    y: component.position.y || 0,
    width: component.position.width || component.data.width || 200,
    height: component.position.height || component.data.height || 100
  }

  for (const other of components) {
    if (excludeId && other.id === excludeId) {
      continue
    }

    // 방어 코드: other의 position이나 data가 없으면 skip
    if (!other.position || !other.data) {
      continue
    }

    const rect2 = {
      x: other.position.x || 0,
      y: other.position.y || 0,
      width: other.position.width || other.data.width || 200,
      height: other.position.height || other.data.height || 100
    }

    if (isOverlapping(rect1, rect2)) {
      return true
    }
  }

  return false
}

/**
 * 빈 공간 찾기 (50px 그리드 기반)
 * @param {number} width - 배치할 컴포넌트의 너비
 * @param {number} height - 배치할 컴포넌트의 높이
 * @param {Array} components - 기존 컴포넌트들
 * @param {Object} canvas - 캔버스 크기 { width }
 * @returns {Object|null} { x, y } 또는 null
 */
export function findEmptySpace(width, height, components, canvas = { width: 800 }) {
  const gridSize = 50
  const maxX = canvas.width - width

  // 높이 제한 제거: 기존 컴포넌트 중 가장 아래 위치 찾기
  let maxY = 0
  if (components && components.length > 0) {
    components.forEach(comp => {
      if (comp.position) {
        const compBottom = (comp.position.y || 0) + (comp.position.height || comp.data?.height || 100)
        maxY = Math.max(maxY, compBottom)
      }
    })
  }

  // 최소 스캔 높이를 1200px로 설정하되, 컴포넌트가 더 아래 있으면 그 아래까지 스캔
  const scanHeight = Math.max(1200, maxY + 500)

  // 그리드 기반으로 스캔
  for (let y = 0; y <= scanHeight; y += gridSize) {
    for (let x = 0; x <= maxX; x += gridSize) {
      const testComponent = {
        position: { x, y, width, height },
        data: { width, height }
      }

      if (!hasCollision(testComponent, components)) {
        return { x, y }
      }
    }
  }

  return null
}

/**
 * 원점에서 가장 가까운 빈 공간 찾기 (나선형 검색)
 * @param {number} originX - 원래 X 위치
 * @param {number} originY - 원래 Y 위치
 * @param {number} width - 컴포넌트 너비
 * @param {number} height - 컴포넌트 높이
 * @param {Array} components - 기존 컴포넌트들
 * @param {Object} canvas - 캔버스 크기
 * @param {number} maxRadius - 최대 검색 반경 (기본 300px)
 * @returns {Object|null} { x, y } 또는 null
 */
export function findNearestEmptySpace(originX, originY, width, height, components, canvas = { width: 800 }, maxRadius = 300) {
  const step = 20
  let bestPosition = null
  let bestDistance = Infinity

  // 나선형으로 주변 검색
  for (let radius = 0; radius <= maxRadius; radius += step) {
    // 상하좌우 및 대각선 방향 검색
    const positions = [
      { x: originX, y: originY - radius }, // 위
      { x: originX, y: originY + radius }, // 아래
      { x: originX - radius, y: originY }, // 왼쪽
      { x: originX + radius, y: originY }, // 오른쪽
      { x: originX - radius, y: originY - radius }, // 왼쪽 위
      { x: originX + radius, y: originY - radius }, // 오른쪽 위
      { x: originX - radius, y: originY + radius }, // 왼쪽 아래
      { x: originX + radius, y: originY + radius }  // 오른쪽 아래
    ]

    for (const pos of positions) {
      // 캔버스 경계 체크 (높이 제한 제거)
      if (pos.x < 0 || pos.y < 0 || pos.x + width > canvas.width) {
        continue
      }

      const testComponent = {
        position: { x: pos.x, y: pos.y, width, height },
        data: { width, height }
      }

      if (!hasCollision(testComponent, components)) {
        const distance = Math.sqrt(Math.pow(pos.x - originX, 2) + Math.pow(pos.y - originY, 2))
        if (distance < bestDistance) {
          bestDistance = distance
          bestPosition = { x: pos.x, y: pos.y }
        }
      }
    }

    // 빈 공간을 찾았으면 바로 반환
    if (bestPosition !== null) {
      return bestPosition
    }
  }

  return bestPosition
}

/**
 * 충돌 해결 - 겹침이 있으면 가장 가까운 빈 공간으로 이동
 * @param {Object} component - 배치할 컴포넌트
 * @param {Object} newPosition - 원하는 위치 { x, y }
 * @param {Array} components - 기존 컴포넌트들
 * @param {Object} canvas - 캔버스 크기
 * @returns {Object} 조정된 위치 { x, y, adjusted: boolean }
 */
export function resolveCollision(component, newPosition, components, canvas = { width: 800 }) {
  // 방어 코드: component나 newPosition이 없으면 기본값 반환
  if (!component || !newPosition) {
    console.warn('Invalid component or position for collision resolution')
    return { x: 50, y: 50, adjusted: false }
  }

  // 방어 코드: component.data가 없으면 기본값 사용
  const data = component.data || {}
  const position = component.position || {}

  const width = position.width || data.width || 200
  const height = position.height || data.height || 100

  // 캔버스 높이 제한 제거 (높이는 무제한)
  const boundedX = Math.max(0, Math.min(newPosition.x || 0, canvas.width - width))
  const boundedY = Math.max(0, newPosition.y || 0)

  const testComponent = {
    position: { x: boundedX, y: boundedY, width, height },
    data: { width, height }
  }

  // 충돌이 없으면 그대로 반환
  if (!hasCollision(testComponent, components, component.id)) {
    return { x: boundedX, y: boundedY, adjusted: false }
  }

  // 충돌이 있으면 가장 가까운 빈 공간 찾기 (높이 제한 없음)
  const emptySpace = findNearestEmptySpace(boundedX, boundedY, width, height, components, canvas)

  if (emptySpace) {
    console.log(`Collision detected! Moving from (${boundedX}, ${boundedY}) to (${emptySpace.x}, ${emptySpace.y})`)
    return { x: emptySpace.x, y: emptySpace.y, adjusted: true }
  }

  // 빈 공간을 찾지 못하면 그리드 기반으로 찾기
  const gridSpace = findEmptySpace(width, height, components, canvas)
  if (gridSpace) {
    console.log(`No nearby space found. Using grid search: (${gridSpace.x}, ${gridSpace.y})`)
    return { x: gridSpace.x, y: gridSpace.y, adjusted: true }
  }

  // 그래도 없으면 원래 위치 반환 (경고)
  console.warn('No empty space found! Component may overlap.')
  return { x: boundedX, y: boundedY, adjusted: false }
}
