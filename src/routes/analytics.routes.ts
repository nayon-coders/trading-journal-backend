import express from 'express';
import { getDashboardStats } from '../controllers/analytics.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);

export default router;
