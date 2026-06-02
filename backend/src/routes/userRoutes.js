import express from 'express';
const router = express.Router();
import { getAllUsers, getUserById, updateUser, deleteUser, getMentors  } from '../controllers/userController.js';
import { protect, authorize  } from '../middlewares/auth.js';

router.use(protect);
router.get('/mentors', getMentors);
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
