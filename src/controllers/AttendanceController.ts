import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { attendanceValidation } from '../validations';
import { AuthenticatedRequest, ApiResponse } from '../types';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate query parameters
      const { error, value } = attendanceValidation.filters.validate(req.query);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.attendanceService.findAll(value);

      const response: ApiResponse<typeof result> = {
        success: true,
        message: 'Attendance records retrieved successfully',
        data: result,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to retrieve attendance records',
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
          message: 'Invalid attendance record ID',
        };
        res.status(400).json(response);
        return;
      }

      const attendance = await this.attendanceService.findById(id);
      if (!attendance) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Attendance record not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof attendance> = {
        success: true,
        message: 'Attendance record retrieved successfully',
        data: attendance,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to retrieve attendance record',
      };
      res.status(500).json(response);
    }
  };

  createOrUpdate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error, value } = attendanceValidation.create.validate(req.body);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const attendance = await this.attendanceService.createOrUpdate(value);

      const response: ApiResponse<typeof attendance> = {
        success: true,
        message: 'Attendance recorded successfully',
        data: attendance,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to record attendance',
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
          message: 'Invalid attendance record ID',
        };
        res.status(400).json(response);
        return;
      }

      // Check if attendance record exists
      const existingAttendance = await this.attendanceService.findById(id);
      if (!existingAttendance) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Attendance record not found',
        };
        res.status(404).json(response);
        return;
      }

      // Validate request body
      const { error, value } = attendanceValidation.update.validate(req.body);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const attendance = await this.attendanceService.update(id, value);

      const response: ApiResponse<typeof attendance> = {
        success: true,
        message: 'Attendance record updated successfully',
        data: attendance,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to update attendance record',
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
          message: 'Invalid attendance record ID',
        };
        res.status(400).json(response);
        return;
      }

      // Check if attendance record exists
      const existingAttendance = await this.attendanceService.findById(id);
      if (!existingAttendance) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Attendance record not found',
        };
        res.status(404).json(response);
        return;
      }

      const success = await this.attendanceService.delete(id);

      const response: ApiResponse<null> = {
        success,
        message: success ? 'Attendance record deleted successfully' : 'Failed to delete attendance record',
      };

      res.status(success ? 200 : 400).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to delete attendance record',
      };
      res.status(500).json(response);
    }
  };
}