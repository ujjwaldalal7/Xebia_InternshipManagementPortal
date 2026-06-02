// ──────────────────────────────────────────────────────
// User Service — Business Logic for User Management
// ──────────────────────────────────────────────────────
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

class UserService {
  /**
   * Get all users with optional role filtering and pagination.
   * @param {Object} query - { role, page, limit, search }
   * @returns {Object} { users, pagination }
   */
  static async getAllUsers(query = {}) {
    const { role, page = 1, limit = 10, search } = query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single user by ID.
   * @param {string} userId
   * @returns {Object} User document
   */
  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Update a user's profile.
   * @param {string} userId - ID of the user to update
   * @param {Object} updateData - Fields to update
   * @param {Object} requestingUser - The user making the request
   * @returns {Object} Updated user document
   */
  static async updateUser(userId, updateData, requestingUser) {
    // Prevent non-admins from updating other users
    if (requestingUser.role !== 'admin' && requestingUser._id.toString() !== userId) {
      throw new AppError('Not authorized to update this user', 403);
    }

    // Prevent role changes by non-admins
    if (updateData.role && requestingUser.role !== 'admin') {
      throw new AppError('Only admins can change user roles', 403);
    }

    // Never allow password update through this endpoint
    delete updateData.password;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Delete (deactivate) a user. Only admins can do this.
   * @param {string} userId
   * @returns {Object} Deactivated user
   */
  static async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Get all mentors (for dropdowns and assignments).
   * @returns {Array} List of mentor users
   */
  static async getMentors() {
    return await User.find({ role: 'mentor', isActive: true }).select(
      'name email avatar department'
    );
  }
}

export default UserService;
