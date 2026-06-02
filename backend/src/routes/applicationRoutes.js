import express from 'express';
const router = express.Router();
import { applyToInternship, getApplications, getApplicationById, updateApplicationStatus, withdrawApplication  } from '../controllers/applicationController.js';
import { protect, authorize  } from '../middlewares/auth.js';

router.use(protect);
router.post('/', authorize('intern'), applyToInternship);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id/status', authorize('admin', 'mentor'), updateApplicationStatus);
router.put('/:id/withdraw', authorize('intern'), withdrawApplication);

export default router;
