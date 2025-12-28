export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Next.js + Tailwind CSS
        </h1>
        <div className="text-center">
          <p className="text-lg mb-4">
            React + Next.js + Tailwind CSS 프로젝트가 설정되었습니다.
          </p>
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              크로스 플랫폼 호환 설정이 완료되었습니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

