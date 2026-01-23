'use client';

import type { AxiosError } from 'axios';
import apiClient from './axiosInstance';

// ============================================================================
// 타입 정의
// ============================================================================

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminMeResponse {
  id: number;
  username: string;
  role: string;
  [key: string]: unknown;
}

// ============================================================================
// API 함수
// ============================================================================

/**
 * 현재 로그인된 어드민 정보 조회
 * @returns 어드민 정보 또는 null (로그인되지 않은 경우)
 */
export async function fetchAdminMe(): Promise<AdminMeResponse | null> {
  try {
    const res = await apiClient.get<AdminMeResponse>('/api/admin/me');
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError;

    // 401, 403: 인증되지 않음 (정상적인 경우)
    if (err.response?.status === 401 || err.response?.status === 403) {
      return null;
    }

    throw err;
  }
}

/**
 * 어드민 로그인
 * @param payload 로그인 정보 (username, password)
 * @returns 토큰 정보 (accessToken, refreshToken)
 */
export async function loginAdmin(
  payload: AdminLoginRequest,
): Promise<AdminLoginResponse> {
  const res = await apiClient.post<AdminLoginResponse>(
    '/api/admin/login',
    payload,
  );
  return res.data;
}

/**
 * 어드민 로그아웃
 */
export async function logoutAdmin(): Promise<void> {
  await apiClient.post('/api/admin/logout');
}
