import { db } from '../config/database';
import { MonthlyAttendanceSummary, ReportFilters } from '../types';

export class ReportService {
  async getMonthlyAttendanceReport(filters: ReportFilters): Promise<MonthlyAttendanceSummary[]> {
    const { month, employee_id } = filters;
    const [year, monthNum] = month.split('-').map(Number);

    let query = db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .where(db.raw('EXTRACT(YEAR FROM date) = ?', [year]))
      .where(db.raw('EXTRACT(MONTH FROM date) = ?', [monthNum]))
      .select(
        'employees.id as employee_id',
        'employees.name',
        db.raw('COUNT(attendance.id) as days_present'),
        db.raw("SUM(CASE WHEN check_in_time > '09:45:00' THEN 1 ELSE 0 END) as times_late")
      )
      .groupBy('employees.id', 'employees.name')
      .orderBy('employees.id');

    if (employee_id) {
      query = query.where('employees.id', employee_id);
    }

    return query;
  }
}