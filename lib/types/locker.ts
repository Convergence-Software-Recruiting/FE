export type LockerStatus = 'EMPTY' | 'RESERVED' | 'IN_USE' | 'BROKEN' | 'CLOSED';
export type ApplicationStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type RentalStatus = 'ACTIVE' | 'RETURNED';
export type ReturnReason = 'AUTO_END' | 'ADMIN_FORCE' | 'BROKEN_FORCE';
export type Grade = 'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'GRADE_4';
export type Major =
  | 'CONVERGENCE_SOFTWARE'
  | 'APPLIED_SOFTWARE'
  | 'DATA_SCIENCE'
  | 'ARTIFICIAL_INTELLIGENCE';

export interface ActiveRentalSummaryResponse {
  maskedName: string;
  phoneLast4: string;
  rentalStartDate: string;
  rentalEndDate: string;
}

export interface LockerResponse {
  id: number;
  number: number;
  rowNo: number;
  colNo: number;
  status: LockerStatus;
  isFixed: boolean;
  activeRentalSummary?: ActiveRentalSummaryResponse;
}

export interface ApplicationCreateRequest {
  lockerId: number;
  applicantName: string;
  studentId: string;
  phone: string;
  email: string;
  grade: Grade;
  major: Major;
}

export interface ApplicationResponse {
  id: number;
  lockerNumber: number;
  applicantName: string;
  phone: string;
  email: string;
  grade: Grade;
  major: Major;
  status: ApplicationStatus;
  createdAt: string;
  decidedAt?: string;
  decisionReason?: string;
}

export interface RentalResponse {
  id: number;
  lockerNumber: number;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  rentalStartDate: string;
  rentalEndDate: string;
  approvedAt: string;
  returnedAt?: string;
  returnReason?: ReturnReason;
}

export interface SystemConfigResponse {
  id: number;
  applicationOpen: boolean;
  applicationStartDate: string | null;
  applicationEndDate: string | null;
  semesterStartDate: string | null;
  semesterEndDate: string;
  rentalEndDate: string;
  depositAccount: string | null;
  depositAmount: number | null;
  depositDueDays: number | null;
}

export interface SystemConfigCreateRequest {
  semesterStartDate: string;
  semesterEndDate: string;
  rentalEndDate: string;
  depositAccount: string;
  depositAmount: number;
  depositDueDays: number;
}

export type LockerStatisticsResponse = Record<LockerStatus, number>;

export interface RentalHistoryResponse {
  rentalId: number;
  lockerId: number;
  lockerNumber: number;
  studentId: string;
  applicantName: string;
  renterPhone: string;
  renterEmail: string;
  rentalStartDate: string;
  rentalEndDate: string;
  approvedAt: string;
  returnedAt: string | null;
  returnReason: ReturnReason | null;
}
