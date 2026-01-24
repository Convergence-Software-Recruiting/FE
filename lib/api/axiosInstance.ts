'use client';

import axios from 'axios';

// ============================================================================
// Axios 인스턴스 생성
// ============================================================================

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

const apiClient = axios.create({
  baseURL,
});

// ============================================================================
// 요청 인터셉터: 토큰 자동 주입
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================================
// 응답 인터셉터: 에러 처리 (필요시 확장 가능)
// ============================================================================

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;
