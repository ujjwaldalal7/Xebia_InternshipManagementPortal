import UserService from '../services/userService.js';
import { successResponse  } from '../utils/responseFormatter.js';

// @desc    Get all users (admin only)
// @route   GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    successResponse(res, 200, 'Users retrieved', result);
  } catch (error) { next(error); }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    successResponse(res, 200, 'User retrieved', user);
  } catch (error) { next(error); }
};

// @desc    Update user
// @route   PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body, req.user);
    successResponse(res, 200, 'User updated', user);
  } catch (error) { next(error); }
};

// @desc    Delete (deactivate) user
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    successResponse(res, 200, 'User deactivated', user);
  } catch (error) { next(error); }
};

// @desc    Get all mentors
// @route   GET /api/users/mentors
export const getMentors = async (req, res, next) => {
  try {
    const mentors = await UserService.getMentors();
    successResponse(res, 200, 'Mentors retrieved', mentors);
  } catch (error) { next(error); }
};
