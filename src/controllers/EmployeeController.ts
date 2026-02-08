import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { employeeValidation } from '../validations';
import { AuthenticatedRequest, ApiResponse } from '../types';
import path from 'path';
import fs from 'fs';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate query parameters
      const { error, value } = employeeValidation.filters.validate(req.query);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.employeeService.findAll(value);

      const response: ApiResponse<typeof result> = {
        success: true,
        message: 'Employees retrieved successfully',
        data: result,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to retrieve employees',
      };
      res.status(500).json(response);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid employee ID',
        };
        res.status(400).json(response);
        return;
      }

      const employee = await this.employeeService.findById(id);
      if (!employee) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Employee not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof employee> = {
        success: true,
        message: 'Employee retrieved successfully',
        data: employee,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to retrieve employee',
      };
      res.status(500).json(response);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // Handle file upload
      let photoPath: string | null = null;
      if (req.file) {
        photoPath = req.file.path;
      }

      // Validate request body
      const { error, value } = employeeValidation.create.validate(req.body);
      if (error) {
        // Clean up uploaded file if validation fails
        if (photoPath && fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }

        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const employee = await this.employeeService.create(value, photoPath || undefined);

      const response: ApiResponse<typeof employee> = {
        success: true,
        message: 'Employee created successfully',
        data: employee,
      };

      res.status(201).json(response);
    } catch (error: any) {
      // Clean up uploaded file if error occurs
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to create employee',
      };
      res.status(500).json(response);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid employee ID',
        };
        res.status(400).json(response);
        return;
      }

      // Check if employee exists
      const existingEmployee = await this.employeeService.findById(id);
      if (!existingEmployee) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Employee not found',
        };
        res.status(404).json(response);
        return;
      }

      // Handle file upload
      let photoPath = existingEmployee.photo_path;
      if (req.file) {
        // Delete old photo if exists
        if (existingEmployee.photo_path && fs.existsSync(existingEmployee.photo_path)) {
          fs.unlinkSync(existingEmployee.photo_path);
        }
        photoPath = req.file.path;
      }

      // Validate request body
      const { error, value } = employeeValidation.update.validate(req.body);
      if (error) {
        // Clean up uploaded file if validation fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const updateData = { ...value, photo_path: photoPath };
      const employee = await this.employeeService.update(id, updateData);

      const response: ApiResponse<typeof employee> = {
        success: true,
        message: 'Employee updated successfully',
        data: employee,
      };

      res.status(200).json(response);
    } catch (error: any) {
      // Clean up uploaded file if error occurs
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to update employee',
      };
      res.status(500).json(response);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid employee ID',
        };
        res.status(400).json(response);
        return;
      }

      // Check if employee exists
      const existingEmployee = await this.employeeService.findById(id);
      if (!existingEmployee) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Employee not found',
        };
        res.status(404).json(response);
        return;
      }

      const success = await this.employeeService.delete(id);

      const response: ApiResponse<null> = {
        success,
        message: success ? 'Employee deleted successfully' : 'Failed to delete employee',
      };

      res.status(success ? 200 : 400).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to delete employee',
      };
      res.status(500).json(response);
    }
  };
}