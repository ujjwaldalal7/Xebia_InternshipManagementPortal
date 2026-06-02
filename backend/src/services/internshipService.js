// ──────────────────────────────────────────────────────
// Internship Service — Business Logic for Internships
// ──────────────────────────────────────────────────────
import Internship from '../models/Internship.js';
import AppError from '../utils/AppError.js';

class InternshipService {
  /**
   * Create a new internship.
   * @param {Object} data - Internship details
   * @param {Object} user - Creating user (mentor or admin)
   * @returns {Object} Created internship
   */
  static async createInternship(data, user) {
    const internshipData = {
      ...data,
      mentor: user.role === 'admin' ? (data.mentor || user._id) : user._id,
    };

    const internship = await Internship.create(internshipData);
    return await internship.populate('mentor', 'name email avatar');
  }

  /**
   * Get all internships with filters and pagination.
   * @param {Object} query - { domain, type, status, search, page, limit }
   * @param {Object} user - Requesting user (for role-based filtering)
   * @returns {Object} { internships, pagination }
   */
  static async getAllInternships(query = {}, user = null) {
    const { domain, type, status, search, page = 1, limit = 10 } = query;
    const filter = {};

    // Role-based filtering
    if (user && user.role === 'mentor') {
      filter.mentor = user._id;
    }

    // Only show open internships to interns
    if (user && user.role === 'intern') {
      filter.status = { $in: ['open', 'in-progress'] };
    }

    if (domain) filter.domain = { $regex: domain, $options: 'i' };
    if (type) filter.type = type;
    if (status && (!user || user.role !== 'intern')) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Internship.countDocuments(filter);
    const internships = await Internship.find(filter)
      .populate('mentor', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      internships,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single internship by ID.
   * @param {string} id
   * @returns {Object} Internship document
   */
  static async getInternshipById(id) {
    const internship = await Internship.findById(id).populate(
      'mentor',
      'name email avatar bio'
    );
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }
    return internship;
  }

  /**
   * Update an internship.
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} user - Requesting user
   * @returns {Object} Updated internship
   */
  static async updateInternship(id, updateData, user) {
    const internship = await Internship.findById(id);
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    // Only the assigned mentor or admin can update
    if (
      user.role !== 'admin' &&
      internship.mentor.toString() !== user._id.toString()
    ) {
      throw new AppError('Not authorized to update this internship', 403);
    }

    const updated = await Internship.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('mentor', 'name email avatar');

    return updated;
  }

  /**
   * Delete an internship. Only admins can delete.
   * @param {string} id
   * @returns {Object} Deleted internship
   */
  static async deleteInternship(id) {
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }
    return internship;
  }
}

export default InternshipService;
