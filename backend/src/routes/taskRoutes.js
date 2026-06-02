import express from 'express';
const router = express.Router();
import { createTask, getTasks, getTaskById, updateTask, gradeTask  } from '../controllers/taskController.js';
import { protect, authorize  } from '../middlewares/auth.js';

router.use(protect);
router.post('/', authorize('admin', 'mentor'), createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.put('/:id/grade', authorize('admin', 'mentor'), gradeTask);

export default router;
