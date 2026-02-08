import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes';
import { ApiResponse } from './types';

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    }));

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    this.app.use('/uploads', express.static(path.resolve(uploadPath)));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });
  }

  private configureRoutes(): void {
    this.app.use('', routes);

    this.app.use((req: Request, res: Response) => {
      const response: ApiResponse<null> = {
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
      };
      res.status(404).json(response);
    });
  }

  private configureErrorHandling(): void {
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Global error handler:', error);

      const response: ApiResponse<null> = {
        success: false,
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error',
      };

      res.status(500).json(response);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Server URL: ${process.env.SERVER_URL || `http://localhost:${port}`}`);
    });
  }
}

export default App;