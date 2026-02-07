import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: number; email: string; name: string };
}

export interface HRUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface HRUserCreateDTO {
  email: string;
  password: string;
  name: string;
}

export interface HRUserLoginDTO {
  email: string;
  password: string;
}

export interface Employee {
  id: number;
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  salary: number;
  photo_path: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface EmployeeCreateDTO {
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  salary: number;
}

export interface EmployeeUpdateDTO extends Partial<EmployeeCreateDTO> {
  photo_path?: string;
}

export interface EmployeeFilters {
  search?: string;
  designation?: string;
  min_age?: number;
  max_age?: number;
  min_salary?: number;
  max_salary?: number;
  page?: number;
  limit?: number;
}

export interface Attendance {
  id: number;
  employee_id: number;
  date: Date;
  check_in_time: string; // HH:MM:SS format
  created_at: Date;
  updated_at: Date;
}

export interface AttendanceCreateDTO {
  employee_id: number;
  date: Date;
  check_in_time: string;
}

export interface AttendanceUpdateDTO {
  check_in_time?: string;
}

export interface AttendanceFilters {
  employee_id?: number;
  date?: Date;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export interface MonthlyAttendanceSummary {
  employee_id: number;
  name: string;
  days_present: number;
  times_late: number;
}

export interface ReportFilters {
  month: string; // YYYY-MM format
  employee_id?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}