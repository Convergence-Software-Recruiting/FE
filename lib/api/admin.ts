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

export interface AdminFormCreateRequest {
  title: string;
  description: string;
}

export interface AdminFormResponse {
  id: number;
  title: string;
  description: string;
  active: boolean;
  resultOpen: boolean;
  createdAt: string;
}

export interface AdminFormDetailResponse extends AdminFormResponse {
  questions: AdminQuestionResponse[];
}

export type AdminFormListResponse = AdminFormResponse[];

export interface AdminFormResultOpenResponse {
  formId: number;
  resultOpen: boolean;
}

export interface AdminQuestionCreateRequest {
  label: string;
  description?: string | null;
  required: boolean;
}

export interface AdminQuestionUpdateRequest {
  label: string;
  description?: string | null;
  required: boolean;
}

export interface AdminQuestionResponse {
  id: number;
  orderNo: number;
  label: string;
  description: string;
  required: boolean;
  createdAt: string;
}

export interface AdminApplicationSummary {
  applicationId: number;
  name: string;
  studentNo: string;
  major: string; // e.g. 'CONVERGENCE_SOFTWARE'
  grade: string; // e.g. 'GRADE_1' | 'GRADE_2' | ...
  status: string; // e.g. 'RECEIVED'
  submittedAt: string;
}

export interface AdminApplicationAnswer {
  questionId: number;
  value: string;
}

export interface AdminApplicationDetail {
  applicationId: number;
  formId: number;
  name: string;
  studentNo: string;
  major: string;
  grade: string;
  phone: string;
  status: string;
  adminMemo: string | null;
  submittedAt: string;
  answers: AdminApplicationAnswer[];
}

export type AdminApplicationListResponse = AdminApplicationSummary[];

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

/**
 * 모집 폼 생성
 * @param payload 폼 제목/설명
 * @returns 생성된 폼 정보
 */
export async function createAdminForm(
  payload: AdminFormCreateRequest,
): Promise<AdminFormResponse> {
  const res = await apiClient.post<AdminFormResponse>('/api/admin/forms', payload);
  return res.data;
}

/**
 * 모집 폼 목록 조회
 * @returns 폼 목록
 */
export async function fetchAdminForms(): Promise<AdminFormListResponse> {
  const res = await apiClient.get<AdminFormListResponse>('/api/admin/forms');
  return res.data;
}

/**
 * 모집 폼 상세 조회 (질문 포함)
 * @param formId 폼 ID
 * @returns 폼 상세 정보
 */
export async function fetchAdminFormDetail(
  formId: number,
): Promise<AdminFormDetailResponse> {
  const res = await apiClient.get<AdminFormDetailResponse>(
    `/api/admin/forms/${formId}`,
  );
  return res.data;
}

/**
 * 모집 폼 삭제
 * @param formId 폼 ID
 */
export async function deleteAdminForm(formId: number): Promise<void> {
  await apiClient.delete(`/api/admin/forms/${formId}`);
}

/**
 * 폼에 질문 추가 (한 번에 한 개)
 * @param formId 폼 ID
 * @param payload 질문 정보
 * @returns 생성된 질문 정보
 */
export async function createAdminFormQuestion(
  formId: number,
  payload: AdminQuestionCreateRequest,
): Promise<AdminQuestionResponse> {
  const res = await apiClient.post<AdminQuestionResponse>(
    `/api/admin/forms/${formId}/questions`,
    payload,
  );
  return res.data;
}

/**
 * 질문 수정
 * @param questionId 질문 ID
 * @param payload 수정할 질문 정보
 * @returns 수정된 질문 정보
 */
export async function updateAdminQuestion(
  questionId: number,
  payload: AdminQuestionUpdateRequest,
): Promise<AdminQuestionResponse> {
  const res = await apiClient.patch<AdminQuestionResponse>(
    `/api/admin/questions/${questionId}`,
    payload,
  );
  return res.data;
}

/**
 * 질문 삭제
 * @param questionId 질문 ID
 */
export async function deleteAdminQuestion(questionId: number): Promise<void> {
  await apiClient.delete(`/api/admin/questions/${questionId}`);
}

/**
 * 모집 폼 활성화 (다른 폼은 자동 비활성화)
 * @param formId 폼 ID
 */
export async function activateAdminForm(formId: number): Promise<void> {
  await apiClient.patch(`/api/admin/forms/${formId}/activate`);
}

/**
 * 모집 종료 (모든 폼 비활성화)
 */
export async function deactivateAdminForms(): Promise<void> {
  await apiClient.patch('/api/admin/forms/deactivate');
}

/**
 * 결과 공개 상태로 변경
 * @param formId 폼 ID
 */
export async function openAdminFormResult(
  formId: number,
): Promise<AdminFormResultOpenResponse> {
  const res = await apiClient.patch<AdminFormResultOpenResponse>(
    `/api/admin/forms/${formId}/result-open`,
    { resultOpen: true },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
}

// ============================================================================
// 지원서 관리 API
// ============================================================================

/**
 * 지원서 목록 조회
 */
export async function fetchAdminApplications(): Promise<AdminApplicationListResponse> {
  const res = await apiClient.get<AdminApplicationListResponse>(
    '/api/admin/applications',
  );
  return res.data;
}

/**
 * 지원서 상세 조회
 * @param applicationId 지원서 ID
 */
export async function fetchAdminApplicationDetail(
  applicationId: number,
): Promise<AdminApplicationDetail> {
  const res = await apiClient.get<AdminApplicationDetail>(
    `/api/admin/applications/${applicationId}`,
  );
  return res.data;
}

/**
 * 지원서 상태 변경
 * @param applicationId 지원서 ID
 * @param status 변경할 상태 값 (예: 'RECEIVED')
 */
export async function updateAdminApplicationStatus(
  applicationId: number,
  status: string,
): Promise<void> {
  const response = await apiClient.patch(
    `/api/admin/applications/${applicationId}/status`,
    { status },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (process.env.NODE_ENV === 'development') {
    console.log('[updateAdminApplicationStatus] 응답:', response.data);
  }
}

/**
 * 지원서 메모 저장/수정
 * @param applicationId 지원서 ID
 * @param adminMemo 메모 내용
 */
export async function updateAdminApplicationMemo(
  applicationId: number,
  adminMemo: string,
): Promise<void> {
  const response = await apiClient.patch(
    `/api/admin/applications/${applicationId}/memo`,
    { adminMemo },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (process.env.NODE_ENV === 'development') {
    console.log('[updateAdminApplicationMemo] 응답:', response.data);
  }
}
