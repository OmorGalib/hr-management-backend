import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';
import { reportValidation } from '../validations';
import { ApiResponse } from '../types';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  getMonthlyAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate query parameters
      const { error, value } = reportValidation.monthlyAttendance.validate(req.query);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const report = await this.reportService.getMonthlyAttendanceReport(value);

      const response: ApiResponse<typeof report> = {
        success: true,
        message: 'Monthly attendance report generated successfully',
        data: report,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Failed to generate report',
      };
      res.status(500).json(response);
    }
  };
}