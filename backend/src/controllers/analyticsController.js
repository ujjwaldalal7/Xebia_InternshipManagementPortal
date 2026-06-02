import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import Task from '../models/Task.js';
import Certificate from '../models/Certificate.js';
import { successResponse  } from '../utils/responseFormatter.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalInternships, totalApplications, totalTasks, totalCertificates] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Internship.countDocuments(),
      Application.countDocuments(),
      Task.countDocuments(),
      Certificate.countDocuments(),
    ]);
    const [interns, mentors, admins] = await Promise.all([
      User.countDocuments({ role: 'intern', isActive: true }),
      User.countDocuments({ role: 'mentor', isActive: true }),
      User.countDocuments({ role: 'admin', isActive: true }),
    ]);
    const [pendingApps, acceptedApps, rejectedApps] = await Promise.all([
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'accepted' }),
      Application.countDocuments({ status: 'rejected' }),
    ]);
    const [openInternships, activeInternships, completedInternships] = await Promise.all([
      Internship.countDocuments({ status: 'open' }),
      Internship.countDocuments({ status: 'in-progress' }),
      Internship.countDocuments({ status: 'completed' }),
    ]);
    const recentApplications = await Application.find()
      .populate('intern', 'name email avatar')
      .populate('internship', 'title company')
      .sort({ createdAt: -1 }).limit(5);
    const recentInternships = await Internship.find()
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 }).limit(5);

    successResponse(res, 200, 'Dashboard stats retrieved', {
      users: { total: totalUsers, interns, mentors, admins },
      internships: { total: totalInternships, open: openInternships, active: activeInternships, completed: completedInternships },
      applications: { total: totalApplications, pending: pendingApps, accepted: acceptedApps, rejected: rejectedApps },
      tasks: { total: totalTasks },
      certificates: { total: totalCertificates },
      recentApplications, recentInternships,
    });
  } catch (error) { next(error); }
};
