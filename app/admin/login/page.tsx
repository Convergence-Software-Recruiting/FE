"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { login, isLoading, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !password) {
      setLocalError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const ok = await login({ username, password });
    if (!ok) {
      setLocalError("로그인에 실패했습니다. 아이디/비밀번호를 다시 확인해 주세요.");
      return;
    }

    router.replace("/admin");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-background via-white to-navy-50/50 ${
        isMobile ? "py-12" : "py-20"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/80 border border-navy-50 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1
            className={`font-bold text-navy-900 mb-6 ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}
          >
            Admin 로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-navy-800">
                아이디
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 bg-white/80"
                placeholder="username"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-navy-800">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 bg-white/80"
                placeholder="••••••••"
              />
            </div>

            {(localError || error) && (
              <p className="text-sm text-red-600">
                {localError ?? error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-navy-800 text-white text-sm font-medium py-2.5 hover:bg-navy-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

