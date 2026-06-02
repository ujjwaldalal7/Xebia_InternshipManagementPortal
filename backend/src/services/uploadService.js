import { cloudinary  } from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

class UploadService {
  static async uploadToCloudinary(fileBuffer, options = {}) {
    const { folder = 'internship-portal', resourceType = 'auto' } = options;
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, ...options },
        (error, result) => {
          if (error) reject(new AppError('Upload failed: ' + error.message, 500));
          else resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(fileBuffer);
    });
  }

  static async deleteFromCloudinary(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error.message);
    }
  }
}

export default UploadService;
