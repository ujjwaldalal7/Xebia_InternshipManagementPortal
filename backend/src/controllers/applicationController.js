import ApplicationService from '../services/applicationService.js';
import { successResponse  } from '../utils/responseFormatter.js';

// @desc    Apply to internship
// @route   POST /api/applications
export const applyToInternship = async (req, res, next) => {
  try {
    const application = await ApplicationService.applyToInternship(req.body, req.user);
    successResponse(res, 201, 'Application submitted', application);
  } catch (error) { next(error); }
};

// @desc    Get applications (role-filtered)
// @route   GET /api/applications
export const getApplications = async (req, res, next) => {
  try {
    const result = await ApplicationService.getApplications(req.query, req.user);
    successResponse(res, 200, 'Applications retrieved', result);
  } catch (error) { next(error); }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await ApplicationService.getApplicationById(req.params.id, req.user);
    successResponse(res, 200, 'Application retrieved', application);
  } catch (error) { next(error); }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await ApplicationService.updateApplicationStatus(req.params.id, req.body, req.user);
    successResponse(res, 200, 'Application status updated', application);
  } catch (error) { next(error); }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await ApplicationService.withdrawApplication(req.params.id, req.user);
    successResponse(res, 200, 'Application withdrawn', application);
  } catch (error) { next(error); }
};
