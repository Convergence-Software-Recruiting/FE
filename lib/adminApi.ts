'use client';

import type { AxiosError } from 'axios';
import apiClient from './axiosInstance';
// 백엔드 Swagger 스펙에 맞춰 필드명을 username/password 로 맞춘다
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

export async function fetchAdminMe(): Promise<AdminMeResponse | null> {
  try {
    const res = await apiClient.get<AdminMeResponse>('/api/admin/me');
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response?.status === 401 || err.response?.status === 403) {
      return null;
    }
    throw err;
  }
}

export async function loginAdmin(
  payload: AdminLoginRequest,
): Promise<AdminLoginResponse> {
  const res = await apiClient.post<AdminLoginResponse>(
    '/api/admin/login',
    payload,
  );
  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  await apiClient.post('/api/admin/logout');
}


