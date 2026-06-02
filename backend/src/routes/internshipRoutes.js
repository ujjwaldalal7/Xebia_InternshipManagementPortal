import express from 'express';
const router = express.Router();
import { createInternship, getAllInternships, getInternshipById, updateInternship, deleteInternship  } from '../controllers/internshipController.js';
import { protect, authorize  } from '../middlewares/auth.js';

router.use(protect);
router.get('/', getAllInternships);
router.get('/:id', getInternshipById);
router.post('/', authorize('admin', 'mentor'), createInternship);
router.put('/:id', authorize('admin', 'mentor'), updateInternship);
router.delete('/:id', authorize('admin'), deleteInternship);

export default router;
