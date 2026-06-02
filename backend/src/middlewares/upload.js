// ──────────────────────────────────────────────────────
// Multer Upload Middleware — File Upload Handling
// ──────────────────────────────────────────────────────
import multer from 'multer';
import path from 'path';

// Use memory storage so files can be streamed to Cloudinary
const storage = multer.memoryStorage();

/**
 * File filter to allow only images and PDFs.
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
