import App from './app';
import { db } from './config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Test database connection
async function testDatabaseConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize and start server
async function startServer(): Promise<void> {
  const app = new App();

  // Test database connection before starting server
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  app.start(PORT);
}

// Handle graceful shutdown
function setupGracefulShutdown(): void {
  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      
      try {
        await db.destroy();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }

      console.log('Shutdown complete');
      process.exit(0);
    });
  });
}

// Start the application
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

setupGracefulShutdown();