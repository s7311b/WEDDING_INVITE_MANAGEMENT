# 웨딩 청첩장 관리 시스템

Vue 3와 Vite를 사용한 웨딩 청첩장 관리 시스템입니다. 관리자는 사용자를 관리하고, 템플릿을 커스터마이징하여 각 사용자에게 고유한 청첩장 페이지를 제공할 수 있습니다.

## 기술 스택

- **프레임워크**: Vue 3 (Composition API + script setup)
- **빌드 도구**: Vite
- **패키지 관리**: Yarn
- **라우팅**: Vue Router 4
- **상태 관리**: Pinia
- **HTTP 클라이언트**: Axios
- **UI**: Tailwind CSS
- **드래그앤드롭**: vue-draggable-plus
- **지도**: Kakao Map API
- **날짜**: dayjs

## 시작하기

### 설치

```bash
yarn install
```

### 개발 서버 실행

#### 옵션 1: Mock 데이터 사용 (기본값)
```bash
yarn dev
```
브라우저에서 `http://localhost:5173` 접속

#### 옵션 2: SQLite 데이터베이스 사용
```bash
# .env.development에서 VITE_USE_DATABASE=true로 설정

# 방법 1: 별도 터미널
yarn server  # 터미널 1: 백엔드 서버
yarn dev     # 터미널 2: 프론트엔드

# 방법 2: 동시 실행 (권장)
yarn dev:full
```

> 📘 **데이터 소스 설정**
> `.env.development` 파일에서 `VITE_USE_DATABASE`를 `true`/`false`로 변경하여 데이터 소스를 전환할 수 있습니다.
> 자세한 내용은 [DATABASE_GUIDE.md](./DATABASE_GUIDE.md)를 참조하세요.

### 빌드

```bash
yarn build
```

### 프로덕션 미리보기

```bash
yarn preview
```

## 기본 로그인 정보

- **관리자 비밀번호**: `admin123`

환경변수 파일(`.env.development`)에서 변경 가능합니다.

## 주요 기능

### 1. 관리자 기능

#### 로그인
- `/admin/login` - 환경변수 기반 비밀번호 인증
- 세션 스토리지 기반 인증 상태 관리

#### 대시보드 (`/admin`)
- 사용자 통계 (전체 사용자, 활성 사용자)
- 템플릿 통계
- 최근 사용자 목록
- 빠른 작업 링크

#### 사용자 관리 (`/admin/users`)
- 사용자 추가, 수정, 삭제
- 사용자 활성화/비활성화 토글
- 청첩장 미리보기 링크
- 사용자별 템플릿 할당

#### 템플릿 관리 (`/admin/templates`)
- 10가지 기본 템플릿 제공
- 템플릿 목록 조회 및 미리보기
- **드래그앤드롭 템플릿 편집기** ✨
  - 컴포넌트를 자유롭게 배치 및 크기 조정
  - 실시간 미리보기
  - 배경 색상 선택 (컬러 팔레트 제공)
  - 배경 이미지 설정
  - 컴포넌트 속성 편집 (텍스트, 갤러리, 링크, 지도)
  - 템플릿 저장 및 관리

#### 커스터마이징 (`/admin/customizations`) ✨
- **사용자별 전용 편집기** 제공
- 드래그앤드롭으로 자유로운 레이아웃 편집
- **템플릿 불러오기** 기능
  - 빈 캔버스에서 시작
  - 저장된 템플릿 불러오기
  - 불러온 템플릿을 자유롭게 수정
- 컴포넌트 추가/삭제/편집
- 배경 색상/이미지 설정
- 실시간 미리보기
- 사용자별 맞춤 저장

### 2. 청첩장 페이지

#### 동적 라우팅 (`/invite/:userId`)
- 사용자별 고유 URL
- 활성화된 사용자만 접근 가능
- 비활성화 또는 없는 사용자는 404 페이지

#### 청첩장 컴포넌트
1. **텍스트 컴포넌트** (`InviteText.vue`)
   - 제목 및 본문
   - 폰트 크기, 색상, 정렬 커스터마이징

2. **갤러리 컴포넌트** (`InviteGallery.vue`)
   - 1x1, 2x1, 2x2, 3x1, 3x3, 4x1 레이아웃 지원
   - 이미지 hover 효과

3. **하이퍼링크 컴포넌트** (`InviteHyperlink.vue`)
   - 버튼 스타일 (primary, secondary, gold, rose)
   - 아이콘 지원 (message, heart, gift, calendar, location, phone, camera)
   - 외부 링크 연결

4. **지도 컴포넌트** (`InviteMap.vue`)
   - Kakao Map 연동
   - 주소 및 장소명 표시
   - 카카오맵/네이버맵 길찾기 링크

## 프로젝트 구조

```
wedding_invite_management/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css              # Tailwind CSS 및 커스텀 스타일
│   ├── components/
│   │   ├── admin/                    # 관리자 컴포넌트
│   │   │   └── UserManagement.vue
│   │   ├── invite/                   # 청첩장 컴포넌트
│   │   │   ├── InviteText.vue
│   │   │   ├── InviteGallery.vue
│   │   │   ├── InviteHyperlink.vue
│   │   │   └── InviteMap.vue
│   │   └── layout/
│   │       └── AdminLayout.vue       # 관리자 레이아웃
│   ├── composables/
│   │   └── useKakaoMap.js            # Kakao Map composable
│   ├── mock/                         # Mock 데이터
│   │   ├── users.json
│   │   ├── templates.json
│   │   └── customizations.json
│   ├── router/
│   │   └── index.js                  # Vue Router 설정
│   ├── services/
│   │   ├── api.js                    # Axios 인스턴스
│   │   ├── mockService.js            # Mock 데이터 서비스
│   │   └── storageService.js         # localStorage 관리
│   ├── stores/                       # Pinia stores
│   │   ├── authStore.js
│   │   ├── userStore.js
│   │   ├── templateStore.js
│   │   └── inviteStore.js
│   ├── views/
│   │   ├── admin/                    # 관리자 뷰
│   │   │   ├── AdminLogin.vue
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── UsersView.vue
│   │   │   ├── TemplatesView.vue
│   │   │   └── CustomizationsView.vue
│   │   └── invite/                   # 청첩장 뷰
│   │       ├── InviteView.vue
│   │       └── NotFound.vue
│   ├── App.vue
│   └── main.js
├── public/
├── .env.development                  # 환경 변수
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 데이터 구조

### 사용자 (User)
```javascript
{
  id: "user001",
  name: "김철수",
  email: "kim@example.com",
  phone: "010-1234-5678",
  isActive: true,
  templateId: "template-1",
  createdAt: "2026-01-15T09:00:00Z",
  weddingDate: "2026-06-14"
}
```

### 템플릿 (Template)
```javascript
{
  id: "template-1",
  name: "클래식 웨딩",
  thumbnail: "/images/templates/classic.jpg",
  category: "classic",
  components: [
    {
      id: "comp-1",
      type: "text",
      order: 1,
      data: { /* 컴포넌트 데이터 */ },
      style: { /* 스타일 */ }
    }
  ]
}
```

### 커스터마이징 (Customization)
```javascript
{
  "user001": {
    userId: "user001",
    templateId: "template-1",
    lastModified: "2026-02-10T14:30:00Z",
    components: [ /* 커스터마이징된 컴포넌트 배열 */ ]
  }
}
```

## 템플릿 편집기 사용 가이드

### 1. 템플릿 생성/편집

1. **새 템플릿 만들기**
   - "템플릿 관리" 페이지에서 "+ 새 템플릿 만들기" 클릭
   - 템플릿 이름 입력

2. **기존 템플릿 편집**
   - 템플릿 카드에서 "편집" 버튼 클릭

### 2. 컴포넌트 추가 및 배치

**왼쪽 패널 (컴포넌트 팔레트):**
- 📝 **텍스트**: 제목과 본문을 포함한 텍스트 블록
- 🖼️ **갤러리**: 다양한 레이아웃의 이미지 갤러리
- 🔗 **버튼/링크**: 외부 링크 연결 버튼
- 📍 **지도**: 카카오맵 연동 지도

**사용 방법:**
1. 원하는 컴포넌트 버튼 클릭
2. 캔버스에 컴포넌트가 추가됨
3. 컴포넌트를 드래그하여 원하는 위치로 이동
4. 모서리를 드래그하여 크기 조정

### 3. 배경 설정

**배경 색상:**
- 컬러 피커로 직접 선택
- Hex 코드 입력 (#FFFFFF)
- 프리셋 색상 팔레트에서 선택

**배경 이미지:**
- 제공된 샘플 이미지 선택
- "없음" 버튼으로 이미지 제거

### 4. 컴포넌트 속성 편집

**오른쪽 패널 (속성 편집):**

컴포넌트를 클릭하면 오른쪽 패널에서 속성 편집 가능:

**텍스트 컴포넌트:**
- 제목, 내용
- 폰트 크기
- 텍스트 색상
- 정렬 (왼쪽/가운데/오른쪽)
- 배경색

**갤러리 컴포넌트:**
- 레이아웃 (1x1, 2x1, 2x2, 3x1, 3x3, 4x1)
- 이미지 URL (한 줄에 하나씩)

**버튼/링크 컴포넌트:**
- 버튼 텍스트
- 링크 URL
- 버튼 스타일 (Primary, Secondary, Gold, Rose)
- 아이콘 선택

**지도 컴포넌트:**
- 장소명
- 주소
- 위도/경도

### 5. 미리보기 및 저장

- **미리보기**: 실제 청첩장 모습으로 확인
- **편집 모드**: 다시 드래그앤드롭 편집 모드로 전환
- **저장**: 템플릿을 localStorage에 저장

### 6. 템플릿 삭제

- 템플릿 카드의 "삭제" 버튼 클릭
- 확인 메시지 후 삭제

## 환경 변수

`.env.development` 파일을 생성하여 다음 변수를 설정하세요:

```env
VITE_ADMIN_PASSWORD=admin123
VITE_KAKAO_MAP_API_KEY=YOUR_KAKAO_MAP_API_KEY
```

### Kakao Map API 키 발급

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 후 애플리케이션 추가
3. Web 플랫폼 등록 (http://localhost:5173)
4. JavaScript 키 복사
5. `.env.development` 파일에 키 설정
6. `index.html`의 스크립트 태그에서 `YOUR_APP_KEY`를 실제 키로 변경

## 테스트 시나리오

### 1. 관리자 로그인
1. `http://localhost:5173` 접속
2. 비밀번호 `admin123` 입력
3. 대시보드 확인

### 2. 사용자 관리
1. 좌측 메뉴에서 "사용자 관리" 클릭
2. "+ 사용자 추가" 버튼 클릭
3. 사용자 정보 입력 및 저장
4. 활성화 토글 테스트
5. "보기" 링크로 청첩장 미리보기

### 3. 청첩장 페이지
1. `/invite/user001` 접속
2. 샘플 사용자의 청첩장 확인
3. 모바일 뷰 테스트 (Chrome DevTools)

### 4. 템플릿 편집
1. "템플릿 관리" 메뉴 클릭
2. 기존 템플릿의 "편집" 버튼 클릭 또는 "+ 새 템플릿 만들기"
3. **드래그앤드롭 편집기 사용:**
   - 왼쪽 팔레트에서 컴포넌트 추가 (텍스트, 갤러리, 버튼/링크, 지도)
   - 캔버스에서 컴포넌트를 드래그하여 위치 조정
   - 컴포넌트 모서리를 드래그하여 크기 조정
   - 오른쪽 속성 패널에서 내용 편집
   - 배경 색상 또는 이미지 선택
4. "미리보기" 버튼으로 실제 모습 확인
5. "저장" 버튼으로 템플릿 저장

### 5. 사용자별 커스터마이징
1. "커스터마이징" 메뉴 클릭
2. 사용자 카드 클릭하여 선택
3. **편집 방법:**
   - "📋 템플릿 불러오기" 클릭
   - 빈 캔버스 또는 저장된 템플릿 선택
   - 드래그앤드롭으로 편집 (템플릿 관리와 동일)
   - 컴포넌트 추가/수정/삭제
   - 배경 설정
4. "저장" 버튼으로 사용자별 커스터마이징 저장
5. "👁️ 미리보기" 버튼으로 실제 청첩장 확인
6. "← 사용자 목록으로" 버튼으로 다른 사용자 선택

## 향후 개발 계획

- [x] 드래그앤드롭 템플릿 빌더 구현 ✅
- [x] 컴포넌트 편집 UI ✅
- [x] 배경 색상/이미지 설정 ✅
- [ ] 이미지 파일 업로드 기능
- [ ] 템플릿 복사 기능
- [ ] 실행 취소/다시 실행 (Undo/Redo)
- [ ] 레이어 관리 (z-index 조정)
- [ ] 커스터마이징 편집기 (템플릿 빌더와 통합)
- [ ] 백엔드 API 연동
- [ ] 데이터베이스 연결
- [ ] 사용자 인증 시스템
- [ ] 방문자 통계
- [ ] 축하 메시지 게스트북
- [ ] 출석 확인 (RSVP)
- [ ] 모바일 앱 (React Native/Flutter)

## 라이선스

MIT

## 기여

버그 리포트 및 기능 제안은 이슈로 등록해주세요.
