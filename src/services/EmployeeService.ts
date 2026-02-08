import { db } from '../config/database';
import {
  Employee,
  EmployeeCreateDTO,
  EmployeeUpdateDTO,
  EmployeeFilters,
  PaginatedResponse,
} from '../types';

export class EmployeeService {
  async findAll(filters: EmployeeFilters = {}): Promise<PaginatedResponse<Employee>> {
    const {
      search,
      designation,
      min_age,
      max_age,
      min_salary,
      max_salary,
      page = 1,
      limit = 10,
    } = filters;

    let query = db('employees').whereNull('deleted_at');

    // Apply filters
    if (search) {
      query = query.where('name', 'ilike', `%${search}%`);
    }

    if (designation) {
      query = query.where('designation', designation);
    }

    if (min_age !== undefined) {
      query = query.where('age', '>=', min_age);
    }

    if (max_age !== undefined) {
      query = query.where('age', '<=', max_age);
    }

    if (min_salary !== undefined) {
      query = query.where('salary', '>=', min_salary);
    }

    if (max_salary !== undefined) {
      query = query.where('salary', '<=', max_salary);
    }

    // Clone query for total count
    const countQuery = query.clone().clearSelect().count('id as total');
    const totalResult = await countQuery.first();
    const total = parseInt(totalResult?.total as string, 10) || 0;

    // Apply pagination
    const offset = (page - 1) * limit;
    const employees = await query
      .select('*')
      .orderBy('id', 'desc')
      .offset(offset)
      .limit(limit);

    return {
      data: employees,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Employee | null> {
    return db('employees').where('id', id).whereNull('deleted_at').first();
  }

  async create(employeeData: EmployeeCreateDTO, photoPath?: string): Promise<Employee> {
    const [employee] = await db('employees')
      .insert({
        ...employeeData,
        photo_path: photoPath || null,
      })
      .returning('*');

    return employee;
  }

  async update(id: number, employeeData: EmployeeUpdateDTO): Promise<Employee | null> {
    const [employee] = await db('employees')
      .where('id', id)
      .whereNull('deleted_at')
      .update(employeeData)
      .returning('*');

    return employee || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db('employees')
      .where('id', id)
      .whereNull('deleted_at')
      .update({ deleted_at: db.fn.now() });

    return result > 0;
  }

  async restore(id: number): Promise<boolean> {
    const result = await db('employees')
      .where('id', id)
      .whereNotNull('deleted_at')
      .update({ deleted_at: null });

    return result > 0;
  }
}