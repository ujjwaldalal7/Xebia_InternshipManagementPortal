import UploadService from '../services/uploadService.js';
import User from '../models/User.js';
import { successResponse  } from '../utils/responseFormatter.js';
import { errorResponse  } from '../utils/responseFormatter.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'No file provided');
    const folder = req.body.folder || 'internship-portal/general';
    const result = await UploadService.uploadToCloudinary(req.file.buffer, { folder });
    successResponse(res, 200, 'File uploaded', result);
  } catch (error) { next(error); }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'No file provided');
    // Delete old avatar if exists
    if (req.user.avatar && req.user.avatar.publicId) {
      await UploadService.deleteFromCloudinary(req.user.avatar.publicId);
    }
    const result = await UploadService.uploadToCloudinary(req.file.buffer, {
      folder: 'internship-portal/avatars',
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
    });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: result }, { new: true });
    successResponse(res, 200, 'Avatar uploaded', user);
  } catch (error) { next(error); }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'No file provided');
    if (req.user.resume && req.user.resume.publicId) {
      await UploadService.deleteFromCloudinary(req.user.resume.publicId);
    }
    const result = await UploadService.uploadToCloudinary(req.file.buffer, {
      folder: 'internship-portal/resumes', resource_type: 'auto',
    });
    const user = await User.findByIdAndUpdate(req.user._id, { resume: result }, { new: true });
    successResponse(res, 200, 'Resume uploaded', user);
  } catch (error) { next(error); }
};
