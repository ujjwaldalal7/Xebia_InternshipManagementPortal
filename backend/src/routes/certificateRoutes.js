import express from 'express';
const router = express.Router();
import { issueCertificate, getCertificates, getCertificateById, verifyCertificate  } from '../controllers/certificateController.js';
import { protect, authorize  } from '../middlewares/auth.js';

// Public route for verification
router.get('/verify/:certificateId', verifyCertificate);

router.use(protect);
router.post('/', authorize('admin', 'mentor'), issueCertificate);
router.get('/', getCertificates);
router.get('/:id', getCertificateById);

export default router;
