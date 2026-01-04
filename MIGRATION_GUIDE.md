# Vite → Next.js App Router 구조 변환 가이드

## 폴더 구조 매핑

### Vite 구조 → Next.js 구조

```
Vite (src/)                    Next.js (루트/)
├── pages/                     ├── app/                    (라우팅)
│   ├── About.tsx      →       │   ├── about/page.tsx
│   ├── Apply.tsx      →       │   ├── apply/page.tsx
│   ├── Index.tsx      →       │   ├── page.tsx (이미 존재)
│   ├── NotFound.tsx   →       │   ├── not-found.tsx
│   └── admin/         →       │   └── admin/page.tsx
│
├── layout/                     ├── components/layout/      (컴포넌트)
├── ui/                         ├── components/ui/
├── NavLink.tsx                 ├── components/NavLink.tsx
│
├── hooks/                      ├── hooks/                  (그대로 유지)
│   ├── useApplicationForm.ts
│   ├── useApplications.ts
│   ├── use-toast.ts
│   └── use-mobile.tsx
│
├── contexts/                   ├── contexts/               (그대로 유지)
│   └── AuthContext.tsx
│
├── lib/                        ├── lib/                    (그대로 유지)
│   └── utils.ts
│
└── constants/                  └── constants/              (그대로 유지)
    └── index.ts
```

## 주요 변환 규칙

### 1. 페이지 라우팅 변환

**Vite (React Router):**
```tsx
// src/pages/About.tsx
export default function About() {
  return <div>About</div>;
}
```

**Next.js App Router:**
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <div>About</div>;
}
```

**변환 포인트:**
- `src/pages/About.tsx` → `app/about/page.tsx`
- 파일명이 URL 경로가 됩니다 (`/about`)
- 각 페이지는 `page.tsx` 파일로 만들어야 합니다

### 2. 클라이언트 컴포넌트

**Next.js App Router는 기본적으로 Server Components입니다.** 
상태 관리, 이벤트 핸들러, 브라우저 API를 사용하는 컴포넌트는 `'use client'` 지시어가 필요합니다.

```tsx
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**필요한 경우:**
- Context Providers (`contexts/AuthContext.tsx`)
- Hooks를 사용하는 컴포넌트
- 이벤트 핸들러가 있는 컴포넌트
- 브라우저 API를 사용하는 컴포넌트

### 3. Context Provider 설정

**Vite:**
```tsx
// src/main.tsx
<AuthProvider>
  <App />
</AuthProvider>
```

**Next.js:**
```tsx
// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Import 경로

**tsconfig.json에 이미 설정된 경로 별칭:**
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

**사용 예시:**
```tsx
// Vite: import { useAuth } from '@/contexts/AuthContext';
// Next.js: 동일하게 사용 가능
import { useAuth } from '@/contexts/AuthContext';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import { NavLink } from '@/components/NavLink';
```

### 5. 라우팅 차이점

| Vite (React Router) | Next.js App Router |
|---------------------|-------------------|
| `<Route path="/about" element={<About />} />` | `app/about/page.tsx` (파일 기반) |
| `<Link to="/about">` | `<Link href="/about">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useParams()` | `useParams()` from `next/navigation` |

### 6. 404 페이지

**Vite:**
```tsx
// src/pages/NotFound.tsx
<Route path="*" element={<NotFound />} />
```

**Next.js:**
```tsx
// app/not-found.tsx (자동으로 404 처리됨)
export default function NotFound() {
  return <div>404</div>;
}
```

## 마이그레이션 체크리스트

- [ ] `src/pages/*.tsx` → `app/*/page.tsx`로 변환
- [ ] `src/layout/`, `src/ui/` → `components/layout/`, `components/ui/`로 이동
- [ ] `src/NavLink.tsx` → `components/NavLink.tsx`로 이동
- [ ] Context Provider를 `app/layout.tsx`에 추가
- [ ] 클라이언트 컴포넌트에 `'use client'` 추가
- [ ] React Router의 `<Link>` → Next.js `<Link>`로 변경
- [ ] `useNavigate()` → `useRouter()`로 변경
- [ ] 모든 import 경로 확인 (`@/` 별칭 사용)

## 추가 참고사항

1. **Server Components vs Client Components**
   - 기본적으로 모든 컴포넌트는 Server Component입니다
   - 필요한 경우에만 `'use client'`를 사용하세요
   - Server Components는 더 나은 성능을 제공합니다

2. **데이터 페칭**
   - Next.js는 Server Components에서 직접 async/await를 사용할 수 있습니다
   - `fetch`는 자동으로 캐싱됩니다

3. **메타데이터**
   - 각 페이지에서 `metadata` export를 사용할 수 있습니다
   ```tsx
   export const metadata = {
     title: 'About Page',
     description: 'About page description',
   };
   ```

