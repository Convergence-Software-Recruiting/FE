'use client';

import type { AxiosError } from 'axios';
import apiClient from './axiosInstance';

// ============================================================================
// 타입 정의
// ============================================================================

export interface ActiveFormResponse {
  formId: number;
  title: string;
  description: string;
  questions: FormQuestion[];
}

export interface FormQuestion {
  id: number;
  orderNo: number;
  label: string;
  description: string | null;
  required: boolean;
}

export interface ApplicationSubmitRequest {
  name: string;
  studentNo: string;
  birthDate: string; // yyyy-MM-dd
  gender: string; // 'MALE' | 'FEMALE'
  major: string; // 'CONVERGENCE_SOFTWARE' 등
  grade: string; // 'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'GRADE_4'
  phone: string;
  firstChoice: string; // Department enum
  secondChoice: string; // Department enum
  thirdChoice: string; // Department enum
  answers: ApplicationAnswer[];
}

export interface ApplicationAnswer {
  questionId: number;
  value: string;
}

export interface ApplicationSubmitResponse {
  applicationId: number;
  resultCode: string;
}

export interface ApplicationResultRequest {
  resultCode: string;
}

export interface ApplicationResultResponse {
  name: string;
  status: string; // 'PASS' | 'FAIL'
}

// ============================================================================
// API 함수
// ============================================================================

/**
 * 활성화된 모집 폼 조회
 * @returns 활성 폼 정보 또는 null (활성 폼이 없는 경우)
 */
export async function fetchActiveForm(): Promise<ActiveFormResponse | null> {
  try {
    const res = await apiClient.get<ActiveFormResponse>('/api/forms/active');
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError;

    // 404: 활성 폼이 없음 (정상적인 경우)
    if (err.response?.status === 404) {
      if (process.env.NODE_ENV === 'development') {
        const backendMessage =
          err.response?.data as { message?: string } | string;
        const message =
          typeof backendMessage === 'string'
            ? backendMessage
            : backendMessage?.message || '활성 폼이 없습니다';

        console.log('[fetchActiveForm] 활성 폼 없음 (404):', {
          backendResponse: err.response?.data,
          message,
        });
      }
      return null;
    }

    // 기타 에러는 상위로 전파
    if (process.env.NODE_ENV === 'development') {
      console.error('[fetchActiveForm] 에러:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: err.config?.baseURL,
      });
    }
    throw err;
  }
}

/**
 * 지원서 제출
 * @param payload 지원서 제출 데이터
 * @returns 제출 결과 (applicationId, resultCode)
 */
export async function submitApplication(
  payload: ApplicationSubmitRequest,
): Promise<ApplicationSubmitResponse> {
  const res = await apiClient.post<ApplicationSubmitResponse>(
    '/api/forms/active/apply',
    payload,
  );
  return res.data;
}

/**
 * 지원 결과 조회
 * @param payload 결과 조회 코드
 * @returns 지원 결과 정보
 */
export async function fetchApplicationResult(
  payload: ApplicationResultRequest,
): Promise<ApplicationResultResponse> {
  const res = await apiClient.post<ApplicationResultResponse>(
    '/api/applications/result',
    payload,
  );
  return res.data;
}
