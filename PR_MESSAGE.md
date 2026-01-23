# 🔐 어드민 인증 시스템 및 지원서 작성/조회 기능 구현

## 📋 개요

어드민 로그인/인증 시스템을 구축하고, 지원자가 지원서를 작성하고 결과를 조회할 수 있는 기능을 구현했습니다. 또한 404 페이지와 어드민 페이지의 디자인을 메인 페이지와 일관성 있게 개선했습니다.

## ✨ 주요 변경사항

### 1. 인증 시스템 구축

#### 1.1 상태 관리 리팩토링
- **Zustand 도입**: Context API에서 Zustand로 전환하여 상태 관리 단순화
- **useAuthStore 구현**: 인증 상태, 토큰 관리, 로그인/로그아웃 로직 중앙화
- **AuthContext 리팩토링**: Zustand 스토어를 래핑하는 얇은 레이어로 변경

#### 1.2 API 클라이언트 설정
- **axios 인스턴스 생성**: 공통 baseURL, 인터셉터 설정
- **토큰 기반 인증**: localStorage에 accessToken/refreshToken 저장
- **자동 토큰 주입**: 요청 인터셉터에서 Authorization 헤더 자동 추가

#### 1.3 어드민 API 함수
- **로그인 API**: `POST /api/admin/login` - username/password로 로그인
- **정보 조회 API**: `GET /api/admin/me` - 현재 로그인된 어드민 정보 조회
- **로그아웃 API**: `POST /api/admin/logout` - 로그아웃 처리

### 2. 어드민 페이지 구현

#### 2.1 어드민 로그인 페이지 (`/admin/login`)
- **UI 구현**: 메인 페이지와 일관된 디자인 스타일
- **폼 검증**: 아이디/비밀번호 필수 입력 검증
- **에러 처리**: 로그인 실패 시 사용자 친화적 에러 메시지
- **자동 리다이렉트**: 이미 로그인된 경우 `/admin`으로 리다이렉트

#### 2.2 어드민 대시보드 (`/admin`)
- **로그인 상태별 UI 분기**:
  - 로그인 안 된 상태: 메인 페이지 스타일의 안내 화면 + 로그인 버튼
  - 로그인된 상태: 어드민 정보 표시 (ID, 사용자명, 권한)
- **로딩/에러 상태 처리**: 각 상태별 적절한 UI 표시

### 3. 지원서 작성/조회 시스템

#### 3.1 지원서 API 함수
- **활성 폼 조회**: `GET /api/forms/active` - 현재 모집 중인 폼 및 질문 조회
- **지원서 제출**: `POST /api/forms/active/apply` - 개인정보 + 질문 답변 제출
- **결과 조회**: `POST /api/applications/result` - resultCode로 지원 결과 조회

#### 3.2 지원서 작성 페이지 (`/apply`)
- **개인정보 입력 섹션**:
  - 이름, 학번, 전공, 학년, 전화번호 입력 필드
  - 필수 필드 검증
  - 전공/학년 드롭다운 선택
- **동적 질문 섹션**:
  - 서버에서 받은 질문을 `orderNo` 순서로 정렬하여 표시
  - 각 질문의 `label`, `description`, `required` 정보 표시
  - 텍스트 입력 (textarea) 형태로 답변 수집
- **제출 처리**:
  - 필수 필드 및 필수 질문 검증
  - 제출 성공 시 `resultCode` 발급 및 표시
  - 중복 제출 방지 (409 에러 처리)
- **상태별 UI**:
  - 로딩 상태: 스피너 및 안내 메시지
  - 활성 폼 없음: 모집 기간이 아님 안내
  - 제출 성공: 결과 조회 코드 표시

#### 3.3 지원 결과 조회 페이지 (`/apply/result`)
- **결과 조회 폼**: resultCode 입력으로 결과 조회
- **결과 표시**:
  - 합격/불합격/심사중 상태 아이콘 및 색상 구분
  - 결과 메시지 표시
  - 지원서 ID 표시 (있는 경우)
- **에러 처리**: 잘못된 코드 입력 시 친화적 에러 메시지

### 4. 페이지 디자인 개선

#### 4.1 404 페이지 (`/not-found`)
- **메인 페이지 스타일 적용**: 동일한 그라데이션 배경 및 패턴
- **애니메이션 효과**: fade-up 애니메이션 적용
- **CTA 버튼**: 메인으로 돌아가기 버튼 추가

#### 4.2 어드민 페이지 로그인 안 된 상태
- **메인 페이지 스타일 적용**: 일관된 디자인 언어
- **Lock 아이콘**: 시각적 피드백 제공
- **명확한 안내 메시지**: 로그인 필요성 및 방법 안내

### 5. 버그 수정

#### 5.1 Hydration 에러 수정
- **문제**: `useResponsive` 훅이 서버/클라이언트에서 다른 값을 반환하여 Hydration 에러 발생
- **해결**: `mounted` 상태를 도입하여 초기 렌더링 시 서버와 동일한 기본값 반환
- **영향**: 모든 페이지의 Hydration 에러 해결

## 🎯 기술적 개선사항

### 의존성 추가
- **axios**: HTTP 클라이언트
- **zustand**: 경량 상태 관리 라이브러리

### 파일 구조

```
lib/
├── adminApi.ts          # 어드민 API 함수
├── applicationApi.ts    # 지원서 API 함수
└── axiosInstance.ts     # axios 인스턴스 설정

stores/
└── useAuthStore.ts      # Zustand 인증 스토어

app/
├── admin/
│   ├── login/
│   │   └── page.tsx     # 어드민 로그인 페이지
│   └── page.tsx         # 어드민 대시보드
└── apply/
    ├── page.tsx         # 지원서 작성 페이지
    └── result/
        └── page.tsx     # 지원 결과 조회 페이지
```

### 타입 정의

#### 어드민 API
```typescript
AdminLoginRequest { username, password }
AdminLoginResponse { accessToken, refreshToken }
AdminMeResponse { id, username, role }
```

#### 지원서 API
```typescript
ActiveFormResponse { formId, title, description, questions[] }
FormQuestion { id, orderNo, label, description, required }
ApplicationSubmitRequest { name, studentNo, major, grade, phone, answers[] }
ApplicationSubmitResponse { applicationId, resultCode }
ApplicationResultRequest { resultCode }
ApplicationResultResponse { applicationId, status, result }
```

### 상태 관리 흐름

1. **초기화**: `AuthProvider`에서 `refreshAdmin()` 호출하여 기존 로그인 상태 확인
2. **로그인**: `login()` → 토큰 저장 → `refreshAdmin()` → 어드민 정보 업데이트
3. **로그아웃**: `logout()` → 토큰 삭제 → 상태 초기화
4. **자동 토큰 주입**: axios 인터셉터에서 모든 요청에 토큰 자동 추가

## 📊 통계

- **총 변경 파일**: 15개
- **추가된 라인**: +1,741줄
- **삭제된 라인**: -89줄
- **신규 파일**: 7개
  - `lib/adminApi.ts`
  - `lib/applicationApi.ts`
  - `lib/axiosInstance.ts`
  - `stores/useAuthStore.ts`
  - `app/admin/login/page.tsx`
  - `app/apply/result/page.tsx`

## 🔄 API 연동

### 백엔드 Swagger 문서
- Base URL: `https://recruit.bluerack.org`
- Swagger UI: `https://recruit.bluerack.org/swagger-ui/index.html#/`

### 주요 엔드포인트
- `POST /api/admin/login` - 어드민 로그인
- `GET /api/admin/me` - 어드민 정보 조회
- `POST /api/admin/logout` - 어드민 로그아웃
- `GET /api/forms/active` - 활성 폼 조회
- `POST /api/forms/active/apply` - 지원서 제출
- `POST /api/applications/result` - 지원 결과 조회

## ✅ 체크리스트

### 인증 시스템
- [x] Zustand 상태 관리 구현
- [x] axios 인스턴스 및 인터셉터 설정
- [x] 토큰 기반 인증 구현
- [x] 어드민 로그인 API 연동
- [x] 어드민 정보 조회 API 연동
- [x] 로그아웃 기능 구현

### 어드민 페이지
- [x] 로그인 페이지 UI 구현
- [x] 로그인 안 된 상태 디자인 개선
- [x] 로그인된 상태 정보 표시
- [x] 에러 처리 및 사용자 피드백

### 지원서 시스템
- [x] 활성 폼 조회 API 연동
- [x] 지원서 작성 페이지 구현
- [x] 개인정보 입력 폼
- [x] 동적 질문 렌더링
- [x] 지원서 제출 API 연동
- [x] 결과 조회 페이지 구현
- [x] 필수 필드 검증
- [x] 에러 처리

### 디자인 개선
- [x] 404 페이지 디자인 개선
- [x] 어드민 페이지 로그인 안 된 상태 디자인 개선
- [x] 메인 페이지와 일관된 디자인 언어 적용

### 버그 수정
- [x] Hydration 에러 수정

## 🧪 테스트 시나리오

### 어드민 로그인
1. `/admin/login` 접속
2. 아이디/비밀번호 입력
3. 로그인 성공 시 `/admin`으로 리다이렉트
4. 어드민 정보 확인

### 지원서 작성
1. `/apply` 접속
2. 개인정보 입력 (이름, 학번, 전공, 학년, 전화번호)
3. 질문에 답변 입력
4. 제출 성공 시 `resultCode` 확인
5. `/apply/result`에서 `resultCode`로 결과 조회

## 📝 참고사항

### 환경 변수
- `NEXT_PUBLIC_API_BASE_URL`: 백엔드 API Base URL
- `.env.local` 파일에 설정 (Git에 커밋되지 않음)

### 토큰 관리
- `accessToken`: `localStorage`의 `admin_access_token`에 저장
- `refreshToken`: `localStorage`의 `admin_refresh_token`에 저장
- 모든 API 요청에 자동으로 `Authorization: Bearer {token}` 헤더 추가

### 질문 타입
- 현재는 모든 질문이 텍스트 입력 (textarea) 형태
- 향후 다양한 질문 타입 (객관식, 체크박스 등) 지원 가능하도록 구조 설계

### 결과 코드
- 지원서 제출 시 발급되는 고유 코드
- 결과 조회 시 필수 입력값
- 사용자가 안전하게 보관해야 함

## 🚀 향후 개선 사항

- [ ] 토큰 만료 시 자동 갱신 (refresh token)
- [ ] 지원서 임시 저장 기능
- [ ] 파일 업로드 지원 (프로필 사진 등)
- [ ] 다양한 질문 타입 지원 (객관식, 체크박스, 드롭다운 등)
- [ ] 지원서 수정 기능
- [ ] 어드민 대시보드 기능 확장
