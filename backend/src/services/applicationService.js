// ──────────────────────────────────────────────────────
// Application Service — Business Logic for Applications
// ──────────────────────────────────────────────────────
import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import AppError from '../utils/AppError.js';

class ApplicationService {
  /**
   * Submit a new application for an internship.
   * @param {Object} data - { internshipId, coverLetter, resume }
   * @param {Object} user - Applying intern
   * @returns {Object} Created application
   */
  static async applyToInternship(data, user) {
    const { internshipId, coverLetter, resume } = data;

    // Verify internship exists and is open
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }
    if (internship.status !== 'open') {
      throw new AppError('This internship is no longer accepting applications', 400);
    }
    if (internship.filledSeats >= internship.totalSeats) {
      throw new AppError('This internship has no available seats', 400);
    }

    // Check for deadline
    if (internship.applicationDeadline && new Date() > internship.applicationDeadline) {
      throw new AppError('Application deadline has passed', 400);
    }

    // Check if already applied
    const existing = await Application.findOne({
      intern: user._id,
      internship: internshipId,
    });
    if (existing) {
      throw new AppError('You have already applied to this internship', 409);
    }

    const application = await Application.create({
      intern: user._id,
      internship: internshipId,
      coverLetter,
      resume: resume || user.resume,
    });

    return await application.populate([
      { path: 'intern', select: 'name email avatar' },
      { path: 'internship', select: 'title company' },
    ]);
  }

  /**
   * Get applications based on user role.
   * - Intern: sees their own applications
   * - Mentor: sees applications for their internships
   * - Admin: sees all applications
   * @param {Object} query - { status, page, limit }
   * @param {Object} user - Requesting user
   * @returns {Object} { applications, pagination }
   */
  static async getApplications(query = {}, user) {
    const { status, page = 1, limit = 10, internshipId } = query;
    const filter = {};

    // Role-based filtering
    if (user.role === 'intern') {
      filter.intern = user._id;
    } else if (user.role === 'mentor') {
      // Get internships belonging to this mentor
      const mentorInternships = await Internship.find({ mentor: user._id }).select('_id');
      filter.internship = { $in: mentorInternships.map((i) => i._id) };
    }
    // Admin sees all — no filter needed

    if (status) filter.status = status;
    if (internshipId) filter.internship = internshipId;

    const skip = (page - 1) * limit;
    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate('intern', 'name email avatar skills college phone bio resume')
      .populate('internship', 'title company domain')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single application by ID.
   * @param {string} id
   * @param {Object} user - Requesting user
   * @returns {Object} Application document
   */
  static async getApplicationById(id, user) {
    const application = await Application.findById(id)
      .populate('intern', 'name email avatar skills college phone bio resume')
      .populate('internship', 'title company domain duration mentor')
      .populate('reviewedBy', 'name email');

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Authorization check
    if (
      user.role === 'intern' &&
      application.intern._id.toString() !== user._id.toString()
    ) {
      throw new AppError('Not authorized to view this application', 403);
    }

    return application;
  }

  /**
   * Update application status (accept/reject/review).
   * @param {string} id - Application ID
   * @param {Object} data - { status, reviewNote }
   * @param {Object} user - Reviewing mentor/admin
   * @returns {Object} Updated application
   */
  static async updateApplicationStatus(id, data, user) {
    const { status, reviewNote } = data;

    const application = await Application.findById(id).populate('internship');
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Verify the mentor owns this internship (or user is admin)
    if (
      user.role === 'mentor' &&
      application.internship.mentor.toString() !== user._id.toString()
    ) {
      throw new AppError('Not authorized to review this application', 403);
    }

    // Update application status
    application.status = status;
    application.reviewNote = reviewNote || '';
    application.reviewedBy = user._id;
    application.reviewedAt = new Date();

    // If accepted, increment filled seats
    if (status === 'accepted') {
      const internship = await Internship.findById(application.internship._id);
      if (internship.filledSeats >= internship.totalSeats) {
        throw new AppError('No available seats left', 400);
      }
      internship.filledSeats += 1;
      await internship.save();
    }

    await application.save();

    return await application.populate([
      { path: 'intern', select: 'name email avatar' },
      { path: 'internship', select: 'title company' },
      { path: 'reviewedBy', select: 'name email' },
    ]);
  }

  /**
   * Withdraw an application (intern only).
   * @param {string} id
   * @param {Object} user - Intern withdrawing
   * @returns {Object} Updated application
   */
  static async withdrawApplication(id, user) {
    const application = await Application.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.intern.toString() !== user._id.toString()) {
      throw new AppError('Not authorized to withdraw this application', 403);
    }

    if (application.status !== 'pending') {
      throw new AppError('Can only withdraw pending applications', 400);
    }

    application.status = 'withdrawn';
    await application.save();

    return application;
  }
}

export default ApplicationService;
