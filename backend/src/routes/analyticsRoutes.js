import express from 'express';
const router = express.Router();
import { getDashboardStats  } from '../controllers/analyticsController.js';
import { protect, authorize  } from '../middlewares/auth.js';

router.use(protect);
router.get('/dashboard', authorize('admin'), getDashboardStats);

export default router;
