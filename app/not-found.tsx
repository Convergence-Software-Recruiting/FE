import Link from "next/link";

// Server Component로 유지 (더 나은 성능)
// Next.js는 not-found.tsx를 자동으로 404 페이지로 인식합니다
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          메인으로 가기
        </Link>
      </div>
    </div>
  );
}
