import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR Management API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;