// ──────────────────────────────────────────────────────
// Auth Service — Business Logic for Authentication
// ──────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

class AuthService {
  /**
   * Generate a JWT token for the given user ID.
   * @param {string} id - User's MongoDB ObjectId
   * @returns {string} JWT token
   */
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  /**
   * Register a new user.
   * @param {Object} userData - { name, email, password, role }
   * @returns {Object} { user, token }
   */
  static async register(userData) {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Only allow 'intern' role during self-registration
    const user = await User.create({
      name,
      email,
      password,
      role: 'pending',
    });

    const token = this.generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async verifyOtp(email, otp) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('User already verified', 400);
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = this.generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async resendOtp(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('User already verified', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const message = `Your new verification code is: ${otp}\nIt expires in 10 minutes.`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email (Resend)',
        message,
      });
    } catch (error) {
      console.log('Email could not be sent', error);
    }

    return { message: 'OTP resent successfully' };
  }

  /**
   * Authenticate a user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Object} { user, token }
   */
  static async login(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Find user and explicitly include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account has been deactivated. Contact admin.', 403);
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  /**
   * Get the currently authenticated user's profile.
   * @param {string} userId
   * @returns {Object} User document
   */
  static async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export default AuthService;
