import axiosInstance from './axiosInstance';
import type {
  LockerResponse,
  SystemConfigResponse,
  ApplicationCreateRequest,
  ApplicationResponse,
} from '@/lib/types/locker';

export async function fetchLockers(): Promise<LockerResponse[]> {
  const res = await axiosInstance.get<LockerResponse[]>('/api/client/locker');
  return res.data;
}

export async function fetchAvailableLockers(): Promise<LockerResponse[]> {
  const res = await axiosInstance.get<LockerResponse[]>('/api/client/locker/available');
  return res.data;
}

export async function fetchLockerConfig(): Promise<SystemConfigResponse> {
  const res = await axiosInstance.get<SystemConfigResponse>('/api/client/locker/config');
  return res.data;
}

export async function createLockerApplication(
  payload: ApplicationCreateRequest
): Promise<ApplicationResponse> {
  const res = await axiosInstance.post<ApplicationResponse>(
    '/api/client/locker/applications',
    payload
  );
  return res.data;
}
