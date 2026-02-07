import Joi from 'joi';

export const authValidation = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),
};

export const employeeValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 255 characters',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
    }),
    age: Joi.number().integer().min(18).max(100).required().messages({
      'number.min': 'Age must be at least 18',
      'number.max': 'Age cannot exceed 100',
      'number.base': 'Age must be a number',
      'any.required': 'Age is required',
    }),
    designation: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Designation must be at least 2 characters long',
      'string.max': 'Designation cannot exceed 255 characters',
      'string.empty': 'Designation is required',
      'any.required': 'Designation is required',
    }),
    hiring_date: Joi.date().iso().required().messages({
      'date.base': 'Hiring date must be a valid date',
      'date.format': 'Hiring date must be in YYYY-MM-DD format',
      'any.required': 'Hiring date is required',
    }),
    date_of_birth: Joi.date().iso().required().messages({
      'date.base': 'Date of birth must be a valid date',
      'date.format': 'Date of birth must be in YYYY-MM-DD format',
      'any.required': 'Date of birth is required',
    }),
    salary: Joi.number().positive().precision(2).required().messages({
      'number.positive': 'Salary must be a positive number',
      'number.precision': 'Salary can have maximum 2 decimal places',
      'number.base': 'Salary must be a number',
      'any.required': 'Salary is required',
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
    designation: Joi.string().min(2).max(255).optional(),
    hiring_date: Joi.date().iso().optional(),
    date_of_birth: Joi.date().iso().optional(),
    salary: Joi.number().positive().precision(2).optional(),
  }),

  filters: Joi.object({
    search: Joi.string().optional(),
    designation: Joi.string().optional(),
    min_age: Joi.number().integer().min(18).optional(),
    max_age: Joi.number().integer().max(100).optional(),
    min_salary: Joi.number().positive().optional(),
    max_salary: Joi.number().positive().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

export const attendanceValidation = {
  create: Joi.object({
    employee_id: Joi.number().integer().positive().required().messages({
      'number.positive': 'Employee ID must be a positive number',
      'number.base': 'Employee ID must be a number',
      'any.required': 'Employee ID is required',
    }),
    date: Joi.date().iso().required().messages({
      'date.base': 'Date must be a valid date',
      'date.format': 'Date must be in YYYY-MM-DD format',
      'any.required': 'Date is required',
    }),
    check_in_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/)
      .required()
      .messages({
        'string.pattern.base': 'Check-in time must be in HH:MM or HH:MM:SS format',
        'string.empty': 'Check-in time is required',
        'any.required': 'Check-in time is required',
      }),
  }),

  update: Joi.object({
    check_in_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/)
      .required()
      .messages({
        'string.pattern.base': 'Check-in time must be in HH:MM or HH:MM:SS format',
        'string.empty': 'Check-in time is required',
        'any.required': 'Check-in time is required',
      }),
  }),

  filters: Joi.object({
    employee_id: Joi.number().integer().positive().optional(),
    date: Joi.date().iso().optional(),
    from: Joi.date().iso().optional(),
    to: Joi.date().iso().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

export const reportValidation = {
  monthlyAttendance: Joi.object({
    month: Joi.string()
      .pattern(/^\d{4}-\d{2}$/)
      .required()
      .messages({
        'string.pattern.base': 'Month must be in YYYY-MM format',
        'string.empty': 'Month is required',
        'any.required': 'Month is required',
      }),
    employee_id: Joi.number().integer().positive().optional(),
  }),
};