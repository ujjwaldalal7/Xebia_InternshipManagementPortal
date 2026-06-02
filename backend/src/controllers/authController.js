import AuthService from '../services/authService.js';
import { successResponse  } from '../utils/responseFormatter.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    successResponse(res, 201, 'Registration successful', result);
  } catch (error) { next(error); }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    successResponse(res, 200, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { user, token } = await AuthService.verifyOtp(email, otp);
    successResponse(res, 200, 'Email verified successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await AuthService.resendOtp(email);
    successResponse(res, 200, response.message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getMe(req.user._id);
    successResponse(res, 200, 'User profile retrieved', user);
  } catch (error) { next(error); }
};
