import InternshipService from '../services/internshipService.js';
import { successResponse  } from '../utils/responseFormatter.js';

// @desc    Create internship
// @route   POST /api/internships
export const createInternship = async (req, res, next) => {
  try {
    const internship = await InternshipService.createInternship(req.body, req.user);
    successResponse(res, 201, 'Internship created', internship);
  } catch (error) { next(error); }
};

// @desc    Get all internships
// @route   GET /api/internships
export const getAllInternships = async (req, res, next) => {
  try {
    const result = await InternshipService.getAllInternships(req.query, req.user);
    successResponse(res, 200, 'Internships retrieved', result);
  } catch (error) { next(error); }
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await InternshipService.getInternshipById(req.params.id);
    successResponse(res, 200, 'Internship retrieved', internship);
  } catch (error) { next(error); }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
export const updateInternship = async (req, res, next) => {
  try {
    const internship = await InternshipService.updateInternship(req.params.id, req.body, req.user);
    successResponse(res, 200, 'Internship updated', internship);
  } catch (error) { next(error); }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
export const deleteInternship = async (req, res, next) => {
  try {
    await InternshipService.deleteInternship(req.params.id);
    successResponse(res, 200, 'Internship deleted');
  } catch (error) { next(error); }
};
