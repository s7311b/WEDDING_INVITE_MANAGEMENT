# 데이터베이스 설정 가이드

## 개요

이 프로젝트는 두 가지 데이터 소스를 지원합니다:

1. **Mock 데이터 (localStorage)** - 개발 및 테스트용
2. **SQLite 데이터베이스** - 프로덕션용

환경 변수를 통해 간단하게 전환할 수 있습니다.

## 설정 방법

### 1. Mock 데이터 사용 (기본값)

`.env.development` 파일:
```env
VITE_USE_DATABASE=false
```

**특징:**
- 별도 서버 불필요
- 브라우저 localStorage에 데이터 저장
- 빠른 개발 및 테스트
- 새로고침 시에도 데이터 유지

**사용법:**
```bash
yarn dev
```

### 2. SQLite 데이터베이스 사용

`.env.development` 파일:
```env
VITE_USE_DATABASE=true
VITE_API_URL=http://localhost:3000/api
```

**특징:**
- 실제 데이터베이스 사용
- 여러 클라이언트 간 데이터 공유
- 백엔드 API 서버 필요
- 프로덕션 환경에 적합

**사용법:**

#### 옵션 1: 별도 터미널에서 실행
```bash
# 터미널 1: 백엔드 서버
yarn server

# 터미널 2: 프론트엔드
yarn dev
```

#### 옵션 2: 동시 실행 (권장)
```bash
yarn dev:full
```

## 데이터베이스 구조

### Tables

#### users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  isActive INTEGER DEFAULT 1,
  templateId TEXT,
  createdAt TEXT NOT NULL,
  weddingDate TEXT NOT NULL
)
```

#### templates
```sql
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT,
  backgroundColor TEXT DEFAULT '#FFFFFF',
  backgroundImage TEXT,
  components TEXT NOT NULL
)
```

#### customizations
```sql
CREATE TABLE customizations (
  userId TEXT PRIMARY KEY,
  templateId TEXT,
  backgroundColor TEXT DEFAULT '#FFFFFF',
  backgroundImage TEXT,
  components TEXT NOT NULL,
  lastModified TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)
```

## API 엔드포인트

### Users
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제
- `PATCH /api/users/:id/toggle` - 활성화 토글

### Templates
- `GET /api/templates` - 모든 템플릿 조회
- `GET /api/templates/:id` - 특정 템플릿 조회
- `POST /api/templates` - 템플릿 생성
- `PUT /api/templates/:id` - 템플릿 수정
- `DELETE /api/templates/:id` - 템플릿 삭제

### Customizations
- `GET /api/customizations` - 모든 커스터마이징 조회
- `GET /api/customizations/:userId` - 특정 사용자 커스터마이징 조회
- `POST /api/customizations/:userId` - 커스터마이징 저장
- `DELETE /api/customizations/:userId` - 커스터마이징 삭제

### Invite
- `GET /api/invite/:userId` - 청첩장 데이터 조회

### Health
- `GET /api/health` - 서버 상태 확인

## 데이터 마이그레이션

### Mock → SQLite

Mock 데이터는 자동으로 SQLite로 시드됩니다:

1. 첫 실행 시 `/src/mock/*.json` 파일에서 데이터를 읽어옴
2. SQLite 데이터베이스에 자동 삽입
3. 이후 실행에서는 기존 데이터 사용

### SQLite → Mock

백엔드 API를 통해 데이터를 조회하여 JSON 파일로 내보낼 수 있습니다:

```bash
# 예시 (별도 스크립트 작성 필요)
curl http://localhost:3000/api/users > src/mock/users.json
curl http://localhost:3000/api/templates > src/mock/templates.json
curl http://localhost:3000/api/customizations > src/mock/customizations.json
```

## 데이터베이스 파일 위치

SQLite 데이터베이스 파일:
```
server/data/wedding.db
```

**백업:**
```bash
cp server/data/wedding.db server/data/wedding.backup.db
```

**초기화:**
```bash
rm server/data/wedding.db
yarn server  # 새 DB 생성 및 시드
```

## 개발 워크플로우

### 1. 로컬 개발 (Mock 데이터)
```bash
# .env.development
VITE_USE_DATABASE=false

yarn dev
```

### 2. 통합 테스트 (SQLite)
```bash
# .env.development
VITE_USE_DATABASE=true

yarn dev:full
```

### 3. 프로덕션 빌드
```bash
# .env.production
VITE_USE_DATABASE=true
VITE_API_URL=https://your-api-domain.com/api

yarn build
```

## 트러블슈팅

### 백엔드 서버가 시작되지 않음

**문제:** `better-sqlite3` 네이티브 모듈 오류

**해결:**
```bash
yarn add better-sqlite3
```

### CORS 오류

**문제:** 브라우저에서 API 호출 시 CORS 오류

**해결:** 백엔드 서버의 CORS 설정 확인
```javascript
// server/index.js
app.use(cors())
```

### 데이터가 저장되지 않음

**Mock 모드:**
- 브라우저 개발자 도구 > Application > Local Storage 확인
- localStorage가 비활성화되어 있는지 확인

**DB 모드:**
- 백엔드 서버가 실행 중인지 확인
- API URL이 올바른지 확인 (`.env.development`)
- 네트워크 탭에서 API 요청 상태 확인

### 데이터 소스 전환이 안됨

1. `.env.development` 파일 저장 확인
2. Vite 개발 서버 재시작:
   ```bash
   # Ctrl+C로 중지 후
   yarn dev
   ```
3. 브라우저 캐시 및 localStorage 초기화

## 성능 최적화

### Mock 데이터 모드
- ✅ 네트워크 지연 없음
- ✅ 빠른 응답 속도
- ⚠️ 브라우저마다 독립적인 데이터

### SQLite 모드
- ✅ 실제 데이터베이스 성능
- ✅ 여러 클라이언트 간 데이터 공유
- ⚠️ 네트워크 오버헤드
- 💡 인덱스 추가로 조회 성능 향상 가능

## 추가 기능 계획

- [ ] PostgreSQL/MySQL 지원
- [ ] 데이터 백업/복원 UI
- [ ] 데이터 임포트/엑스포트
- [ ] 데이터베이스 마이그레이션 도구
- [ ] 클라우드 스토리지 연동

## 문의

데이터베이스 관련 문제가 있으면 이슈를 등록해주세요.
