import { Request, Response } from 'express';
import { HRUserService } from '../services/HRUserService';
import { authValidation } from '../validations';
import { ApiResponse } from '../types';

export class AuthController {
  private hrUserService: HRUserService;

  constructor() {
    this.hrUserService = new HRUserService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const { error, value } = authValidation.login.validate(req.body);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          errors: error.details.map((detail) => detail.message),
        };
        res.status(400).json(response);
        return;
      }

      const { email, password } = value;
      const result = await this.hrUserService.login({ email, password });

      const response: ApiResponse<typeof result> = {
        success: true,
        message: 'Login successful',
        data: result,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message || 'Login failed',
      };
      res.status(401).json(response);
    }
  };
}