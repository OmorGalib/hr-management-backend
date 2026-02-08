import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { EmployeeController } from '../controllers/EmployeeController';
import { AttendanceController } from '../controllers/AttendanceController';
import { ReportController } from '../controllers/ReportController';
import { authenticate } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { ApiResponse } from '../types';

const router = Router();

// Initialize controllers
const authController = new AuthController();
const employeeController = new EmployeeController();
const attendanceController = new AttendanceController();
const reportController = new ReportController();

// Root endpoint
router.get('/', (req, res) => {
  const response: ApiResponse<Record<string, unknown>> = {
    success: true,
    message: 'HR Management API',
    data: {
      version: '1.0.0',
      documentation: '/health for health check',
      endpoints: {
        auth: 'POST /auth/login',
        employees: 'GET /employees',
        attendance: 'GET /attendance',
        reports: 'GET /reports/attendance'
      }
    }
  };
  res.status(200).json(response);
});

// Auth routes
router.post('/auth/login', authController.login);

// Health check
router.get('/health', (req, res) => {
  const response: ApiResponse<Record<string, unknown>> = {
    success: true,
    message: 'HR Management API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  };
  res.status(200).json(response);
});

// Employee routes (protected)
router.get('/employees', authenticate, employeeController.getAll);
router.get('/employees/:id', authenticate, employeeController.getById);
router.post('/employees', authenticate, uploadSingle('photo'), employeeController.create);
router.put('/employees/:id', authenticate, uploadSingle('photo'), employeeController.update);
router.delete('/employees/:id', authenticate, employeeController.delete);

// Attendance routes (protected)
router.get('/attendance', authenticate, attendanceController.getAll);
router.get('/attendance/:id', authenticate, attendanceController.getById);
router.post('/attendance', authenticate, attendanceController.createOrUpdate);
router.put('/attendance/:id', authenticate, attendanceController.update);
router.delete('/attendance/:id', authenticate, attendanceController.delete);

// Report routes (protected)
router.get('/reports/attendance', authenticate, reportController.getMonthlyAttendance);

export default router;