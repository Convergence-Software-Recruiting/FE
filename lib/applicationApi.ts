'use client';

import type { AxiosError } from 'axios';
import apiClient from './axiosInstance';

// 활성 폼 조회 응답
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

// 지원서 제출 요청
export interface ApplicationSubmitRequest {
  name: string;
  studentNo: string;
  major: string; // 'CONVERGENCE_SOFTWARE' 등
  grade: string; // 'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4' 등
  phone: string;
  answers: ApplicationAnswer[];
}

export interface ApplicationAnswer {
  questionId: number;
  value: string;
}

// 지원서 제출 응답
export interface ApplicationSubmitResponse {
  applicationId: number;
  resultCode: string; // 결과 조회용 코드 (예: "A7K9")
}

// 지원 결과 조회 요청 (resultCode 사용)
export interface ApplicationResultRequest {
  resultCode: string;
}

// 지원 결과 조회 응답
export interface ApplicationResultResponse {
  applicationId: number;
  status?: string; // 'PENDING', 'ACCEPTED', 'REJECTED' 등
  result?: string; // 결과 메시지
  [key: string]: unknown;
}

// 활성 폼 조회
export async function fetchActiveForm(): Promise<ActiveFormResponse | null> {
  try {
    const res = await apiClient.get<ActiveFormResponse>('/api/forms/active');
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response?.status === 404) {
      return null; // 활성 폼이 없음
    }
    throw err;
  }
}

// 지원서 제출
export async function submitApplication(
  payload: ApplicationSubmitRequest,
): Promise<ApplicationSubmitResponse> {
  const res = await apiClient.post<ApplicationSubmitResponse>(
    '/api/forms/active/apply',
    payload,
  );
  return res.data;
}

// 지원 결과 조회 (resultCode 사용)
export async function fetchApplicationResult(
  payload: ApplicationResultRequest,
): Promise<ApplicationResultResponse> {
  const res = await apiClient.post<ApplicationResultResponse>(
    '/api/applications/result',
    payload,
  );
  return res.data;
}
