# 웨딩 청첩장 관리 시스템 - Task List

## 🎯 현재 진행 중

없음 (모든 초기 구현 완료)

## ✅ 완료된 작업

### Phase 1: 프로젝트 초기 설정
- [x] Vue 3 + Vite 프로젝트 생성
- [x] 패키지 설치 (vue-router, pinia, axios, tailwindcss, dayjs)
- [x] Tailwind CSS 설정 (웨딩 테마 색상)
- [x] 폴더 구조 생성
- [x] 환경 변수 설정

### Phase 2: 라우터 및 인증
- [x] Vue Router 설정 (관리자/사용자 라우트)
- [x] 네비게이션 가드 (관리자 인증 확인)
- [x] authStore 구현
- [x] AdminLogin.vue 구현

### Phase 3: 데이터 레이어
- [x] Mock JSON 파일 (users, templates, customizations)
- [x] storageService.js (localStorage 관리)
- [x] mockService.js (CRUD 메서드)
- [x] api.js (Axios 인스턴스)

### Phase 4: Pinia Store
- [x] userStore.js - 사용자 관리
- [x] templateStore.js - 템플릿 관리
- [x] inviteStore.js - 청첩장 데이터 조회

### Phase 5: 청첩장 컴포넌트
- [x] InviteText.vue - 텍스트 컴포넌트
- [x] InviteGallery.vue - 갤러리 (1x1~4x1 레이아웃)
- [x] InviteHyperlink.vue - 버튼/링크
- [x] InviteMap.vue - Kakao Map 연동
- [x] useKakaoMap.js - Kakao Map composable

### Phase 6: 사용자 청첩장 페이지
- [x] InviteView.vue - 동적 라우팅
- [x] NotFound.vue - 404 페이지
- [x] 활성화된 사용자만 접근 가능
- [x] 반응형 디자인

### Phase 7: 사용자 관리
- [x] AdminLayout.vue - 관리자 레이아웃
- [x] AdminDashboard.vue - 대시보드
- [x] UsersView.vue - 사용자 관리 페이지
- [x] UserManagement.vue - 사용자 CRUD

### Phase 8: 템플릿 편집기
- [x] ComponentPalette.vue - 컴포넌트 팔레트 + 배경 설정
- [x] TemplateBuilder.vue - 드래그앤드롭 편집기
- [x] TemplatesView.vue - 템플릿 목록 + 편집/미리보기
- [x] 드래그앤드롭 기능 (vue3-draggable-resizable)
- [x] 컴포넌트 위치/크기 조정
- [x] 배경 색상 선택 (12개 프리셋)
- [x] 배경 이미지 선택
- [x] 속성 편집 패널
- [x] 실시간 미리보기

### Phase 9: 데이터베이스 전환
- [x] 설정 파일 (src/config/index.js)
- [x] apiService.js - SQLite API 서비스
- [x] dataService.js - 서비스 팩토리
- [x] Express 백엔드 서버 (server/index.js)
- [x] SQLite 데이터베이스 (server/database.js)
- [x] 18개 RESTful API 엔드포인트
- [x] 자동 데이터베이스 초기화 및 시드
- [x] Mock ↔ SQLite 전환 (.env 설정)

### Phase 10: 사용자 커스터마이징
- [x] CustomizationsView.vue 전면 재구현
- [x] 사용자 선택 화면 (카드 UI)
- [x] 템플릿 불러오기 모달
- [x] 빈 캔버스 옵션
- [x] 템플릿 목록 미리보기
- [x] 드래그앤드롭 편집 (TemplateBuilder 재사용)
- [x] 사용자별 독립 저장
- [x] 청첩장 미리보기 링크

### 문서화
- [x] README.md - 전체 가이드
- [x] DATABASE_GUIDE.md - DB 설정 가이드
- [x] IMPLEMENTATION_SUMMARY.md - 템플릿 편집 보고서
- [x] FINAL_IMPLEMENTATION.md - 최종 구현 보고서
- [x] progress.md - 개발 진행 상황
- [x] task.md - 작업 목록

### Git & GitHub
- [x] GitHub 레포지토리 생성
- [x] 초기 커밋 (51개 파일, 7,891 라인)
- [x] 푸시 완료

## 📝 백로그 (우선순위별)

### High Priority
- [ ] 이미지 파일 업로드 기능
- [ ] 에러 처리 개선 (Toast 알림)
- [ ] 로딩 상태 개선 (Spinner)

### Medium Priority
- [ ] 템플릿 복사 기능
- [ ] 데이터 백업/복원 UI
- [ ] 컴포넌트 레이어 관리 (z-index)
- [ ] 실행 취소/다시 실행 (Undo/Redo)
- [ ] 그리드 스냅 기능

### Low Priority
- [ ] PostgreSQL/MySQL 지원
- [ ] 사용자 인증 시스템 (JWT)
- [ ] 템플릿 마켓플레이스
- [ ] 클라우드 스토리지 (AWS S3, Google Cloud Storage)
- [ ] 실시간 협업 편집
- [ ] 방문자 통계 대시보드
- [ ] 축하 메시지 게스트북
- [ ] 출석 확인 (RSVP)
- [ ] 이메일/SMS 초대장 발송
- [ ] 모바일 앱 (React Native/Flutter)

## 🐛 알려진 이슈

### 현재 제한사항
1. **이미지 업로드**: 파일 업로드 기능 없음 (URL만 지원)
2. **레이어 순서**: z-index 조정 기능 없음
3. **실행 취소**: Undo/Redo 기능 없음
4. **그리드 정렬**: 자동 정렬 기능 없음
5. **모바일 편집**: 터치 드래그 제한적

### 브라우저 호환성
- Chrome/Edge: ✅ 완벽 지원
- Firefox: ✅ 완벽 지원
- Safari: ⚠️ 테스트 필요
- Mobile: ⚠️ 터치 이벤트 개선 필요

## 📊 진행률

### 전체 진행률: 100% (Phase 1-10 완료)

- Phase 1: ✅ 100%
- Phase 2: ✅ 100%
- Phase 3: ✅ 100%
- Phase 4: ✅ 100%
- Phase 5: ✅ 100%
- Phase 6: ✅ 100%
- Phase 7: ✅ 100%
- Phase 8: ✅ 100%
- Phase 9: ✅ 100%
- Phase 10: ✅ 100%

### 다음 버전 (v2.1.0) 계획
- 이미지 업로드
- 에러 처리 개선
- 템플릿 복사
- 데이터 백업/복원

## 📅 타임라인

- **2026-02-10**: 프로젝트 시작 및 전체 구현 완료
  - Phase 1-10 완료
  - GitHub 업로드
  - 문서화 완료

## 🎓 학습 포인트

### 구현하면서 배운 것
1. **서비스 팩토리 패턴**: 데이터 소스 추상화
2. **드래그앤드롭**: vue3-draggable-resizable 활용
3. **백엔드 통합**: Express + SQLite
4. **환경 변수 관리**: Vite의 import.meta.env
5. **컴포넌트 재사용**: 동일한 편집기를 여러 곳에서 사용
6. **RESTful API 설계**: CRUD 패턴
7. **데이터베이스 설계**: 관계형 스키마
8. **Git 워크플로우**: 초기 커밋 및 푸시
