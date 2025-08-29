import { Router } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;