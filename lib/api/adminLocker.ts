import axiosInstance from './axiosInstance';
import type {
  LockerResponse,
  LockerStatus,
  LockerStatisticsResponse,
  ApplicationResponse,
  RentalResponse,
  RentalHistoryResponse,
  RentalStatus,
  ReturnReason,
  SystemConfigResponse,
  SystemConfigCreateRequest,
} from '@/lib/types/locker';

// ── 사물함 관리 ──────────────────────────────────────────

export async function fetchAdminLockers(): Promise<LockerResponse[]> {
  const res = await axiosInstance.get<LockerResponse[]>('/api/admin/locker');
  return res.data;
}

export async function fetchLockerStatistics(): Promise<LockerStatisticsResponse> {
  const res = await axiosInstance.get<LockerStatisticsResponse>('/api/admin/locker/statistics');
  return res.data;
}

export async function changeLockerStatus(
  id: number,
  status: Extract<LockerStatus, 'EMPTY' | 'CLOSED' | 'BROKEN'>
): Promise<LockerResponse> {
  const params: Record<string, string> = { status };
  const res = await axiosInstance.patch<LockerResponse>(`/api/admin/locker/${id}/status`, null, {
    params,
  });
  return res.data;
}

export async function openAllLockers(): Promise<{ openedCount: number }> {
  const res = await axiosInstance.post<{ openedCount: number }>('/api/admin/locker/open-all');
  return res.data;
}

// ── 신청 관리 ──────────────────────────────────────────

interface FetchApplicationsParams {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function fetchAdminApplications(
  params: FetchApplicationsParams = {}
): Promise<PageResponse<ApplicationResponse>> {
  const res = await axiosInstance.get<PageResponse<ApplicationResponse>>(
    '/api/admin/locker/applications',
    { params }
  );
  return res.data;
}

export async function fetchPendingApplicationsCount(): Promise<number> {
  const res = await axiosInstance.get<number>('/api/admin/locker/applications/pending-count');
  return res.data;
}

export async function approveApplication(id: number): Promise<RentalResponse> {
  const res = await axiosInstance.post<RentalResponse>(
    `/api/admin/locker/applications/${id}/approve`
  );
  return res.data;
}

export async function rejectApplication(
  id: number,
  decisionReason: string
): Promise<void> {
  await axiosInstance.post(`/api/admin/locker/applications/${id}/reject`, { decisionReason });
}

// ── 대여 관리 ──────────────────────────────────────────

export async function returnRental(id: number, reason: ReturnReason): Promise<RentalResponse> {
  const res = await axiosInstance.post<RentalResponse>(
    `/api/admin/locker/rentals/${id}/return`,
    null,
    { params: { reason } }
  );
  return res.data;
}

export async function closeSemester(): Promise<{ returnedCount: number }> {
  const res = await axiosInstance.post<{ returnedCount: number }>(
    '/api/admin/locker/rentals/semester/close'
  );
  return res.data;
}

export async function fetchActiveRentals(): Promise<RentalResponse[]> {
  const res = await axiosInstance.get<RentalResponse[]>('/api/admin/locker/rentals/active');
  return res.data;
}

export async function fetchExpiringRentals(): Promise<RentalResponse[]> {
  const res = await axiosInstance.get<RentalResponse[]>('/api/admin/locker/rentals/expiring');
  return res.data;
}

// ── 학기 설정 관리 ──────────────────────────────────────────

export async function fetchAdminConfig(): Promise<SystemConfigResponse> {
  const res = await axiosInstance.get<SystemConfigResponse>('/api/admin/locker/config');
  return res.data;
}

export async function createSemesterConfig(
  payload: SystemConfigCreateRequest
): Promise<SystemConfigResponse> {
  const res = await axiosInstance.post<SystemConfigResponse>('/api/admin/locker/config', payload);
  return res.data;
}

export async function openApplicationPeriod(
  startDate: string,
  endDate: string
): Promise<SystemConfigResponse> {
  const res = await axiosInstance.post<SystemConfigResponse>(
    '/api/admin/locker/config/application/open',
    null,
    { params: { startDate, endDate } }
  );
  return res.data;
}

export async function closeApplicationPeriod(): Promise<SystemConfigResponse> {
  const res = await axiosInstance.post<SystemConfigResponse>(
    '/api/admin/locker/config/application/close'
  );
  return res.data;
}

// ── 대여 이력 ──────────────────────────────────────────

export interface RentalHistoryParams {
  from?: string;
  to?: string;
  lockerId?: number;
  studentIdHash?: string;
  status?: RentalStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getRentalHistory(
  params: RentalHistoryParams = {}
): Promise<PageResponse<RentalHistoryResponse>> {
  const res = await axiosInstance.get<PageResponse<RentalHistoryResponse>>(
    '/api/admin/locker/rentals/history',
    { params }
  );
  return res.data;
}
