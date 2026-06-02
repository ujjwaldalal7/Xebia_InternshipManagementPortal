import express from 'express';
const router = express.Router();
import { uploadFile, uploadAvatar, uploadResume  } from '../controllers/uploadController.js';
import { protect  } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

router.use(protect);
router.post('/', upload.single('file'), uploadFile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/resume', upload.single('resume'), uploadResume);

export default router;
