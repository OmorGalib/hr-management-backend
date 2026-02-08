import { db } from '../config/database';
import {
  Attendance,
  AttendanceCreateDTO,
  AttendanceUpdateDTO,
  AttendanceFilters,
  PaginatedResponse,
} from '../types';

export class AttendanceService {
  async findAll(filters: AttendanceFilters = {}): Promise<PaginatedResponse<Attendance>> {
    const {
      employee_id,
      date,
      from,
      to,
      page = 1,
      limit = 10,
    } = filters;

    let query = db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .select('attendance.*');

    // Apply filters
    if (employee_id) {
      query = query.where('employee_id', employee_id);
    }

    if (date) {
      query = query.where('date', date);
    }

    if (from) {
      query = query.where('date', '>=', from);
    }

    if (to) {
      query = query.where('date', '<=', to);
    }

    // Clone query for total count
    const countQuery = query.clone().clearSelect().count('attendance.id as total');
    const totalResult = await countQuery.first();
    const total = parseInt(totalResult?.total as string, 10) || 0;

    // Apply pagination
    const offset = (page - 1) * limit;
    const attendance = await query
      .orderBy(['date', 'check_in_time'])
      .offset(offset)
      .limit(limit);

    return {
      data: attendance,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Attendance | null> {
    return db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .where('attendance.id', id)
      .select('attendance.*')
      .first();
  }

  async createOrUpdate(attendanceData: AttendanceCreateDTO): Promise<Attendance> {
    const [attendance] = await db('attendance')
      .insert(attendanceData)
      .onConflict(['employee_id', 'date'])
      .merge({
        check_in_time: attendanceData.check_in_time,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return attendance;
  }

  async update(id: number, attendanceData: AttendanceUpdateDTO): Promise<Attendance | null> {
    const [attendance] = await db('attendance')
      .where('id', id)
      .update(attendanceData)
      .returning('*');

    return attendance || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db('attendance').where('id', id).delete();
    return result > 0;
  }
}